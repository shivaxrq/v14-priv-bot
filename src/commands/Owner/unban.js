const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, User, MessageEmbed } = require("discord.js");

module.exports = {
    name: "unban",
    aliases: [],
    cooldown: 5000,
    run: async (client, message, args) => {
        if (!message.member.permissions.has('BAN_MEMBERS')) 
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });

        const userID = args[0];
        if (!userID)
            return message.reply({ content: "Lütfen bir kullanıcı ID'si veya mention'ı belirtin." });

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle("Unban İşlemi")
            .setDescription(`Bu kullanıcının yasağını kaldırmak için butona tıklayın: ${userID}`);

        const unbanButton = new ButtonBuilder()
            .setCustomId('unban')
            .setLabel('Unban')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const row = new ActionRowBuilder()
            .addComponents(unbanButton);

        const reply = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'unban' && i.user.id === message.author.id;

        const collector = reply.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            await i.update({ content: "İşlem yapılıyor...", components: [] });
            message.guild.members.unban(userID)
                .then(user => {
                    const successEmbed = new EmbedBuilder()
                        .setColor(0x2B2D31)
                        .setDescription(`${user.tag} başarıyla yasağı kaldırıldı.`);
                    message.channel.send({ embeds: [successEmbed] });
                })
                .catch(error => {
                    console.error("Bir hata oluştu:", error);
                    message.reply({ content: "Kullanıcı yasağı kaldırılırken bir hata oluştu." });
                });
        });

        collector.on('end', collected => {
            if (collected.size === 0)
                message.reply({ content: 'İşlem zaman aşımına uğradı, lütfen tekrar deneyin.', components: [] });
        });
    }
};
