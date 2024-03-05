const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageEmbed } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    aliases: [],
    cooldown: 5000,
    run: async (client, message, args) => {
        if (!message.member.permissions.has('BAN_MEMBERS')) 
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });

        const member = message.mentions.members.first();
        if (!member)
            return message.reply({ content: "Lütfen yasaklanacak üyeyi etiketleyin." });

        const reason = args.slice(1).join(" ") || "Neden belirtilmedi.";

        const yesButton = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('Evet')
            .setStyle(ButtonStyle.Danger);

        const noButton = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('Hayır')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(yesButton, noButton);

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle("Üye Yasaklama")
            .setDescription(`Emin misiniz? ${member} kişisini sunucudan yasaklamak istediğinize emin misiniz?\n\n**Neden:** ${reason}`)
            .setTimestamp();

        const reply = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => (i.customId === 'yes' || i.customId === 'no') && i.user.id === message.author.id;

        const collector = reply.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            if (i.customId === 'yes') {
                await i.update({ content: "İşlem yapılıyor...", components: [] });
                await member.ban({ reason });
                const successEmbed = new EmbedBuilder()
                    .setColor(0x2B2D31)
                    .setTitle("Üye Yasaklandı")
                    .setDescription(`${member} başarıyla yasaklandı!\n\n**Neden:** ${reason}`)
                    .setTimestamp();
                message.channel.send({ embeds: [successEmbed] });
            } else if (i.customId === 'no') {
                await i.update({ content: "Yasaklama işlemi iptal edildi.", components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0)
                message.reply({ content: 'İşlem zaman aşımına uğradı, lütfen tekrar deneyin.', components: [] });
        });
    }
};
