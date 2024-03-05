const fs = require("fs");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require("discord.js");

// Emojileri setup.js dosyasına ekle
const emojis = require("../../../emojikur.json");

module.exports = {
    name: "setup",
    aliases: [],
    cooldown: 5000,
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle("Kurulum")
            .setDescription("Hangi işlemi yapmak istediğinizi seçin:");

        const roleButton = new ButtonBuilder()
            .setCustomId('roleSetup')
            .setLabel('Rol Kur')
            .setStyle('Primary');

        const emojiButton = new ButtonBuilder()
            .setCustomId('emojiSetup')
            .setLabel('Emoji Kur')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(roleButton, emojiButton);

        const reply = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => (i.customId === 'roleSetup' || i.customId === 'emojiSetup') && i.user.id === message.author.id;

        const collector = reply.createMessageComponentCollector({
            filter,
            time: 15000
        });

        collector.on('collect', async i => {
            await i.update({ content: "İşlem yapılıyor...", components: [] });
            if (i.customId === 'roleSetup') {
                // Rol kurma işlemini gerçekleştir
                const guild = message.guild;
                let giveawayRole = await guild.roles.create({
                    name: 'Çekiliş Katılımcısı',
                    color: '0099ff'
                });

                let eventRole = await guild.roles.create({
                    name: 'Etkinlik Katılımcısı',
                    color: '0099ff'
                });

                // Rollerin oluşturulduğunu bildir
                const successEmbed = new EmbedBuilder()
                    .setColor(0x2B2D31)
                    .setDescription("Roller başarıyla oluşturuldu.");
                message.channel.send({ embeds: [successEmbed] });
            } else if (i.customId === 'emojiSetup') {
                // Emoji kurma işlemini gerçekleştir
                emojis.forEach(async emojiData => {
                    try {
                        // Emojiyi sunucuya ekle
                        await message.guild.emojis.create(emojiData.url, { name: emojiData.name });
                        console.log(`${emojiData.name} emoji başarıyla oluşturuldu.`);
                    } catch (error) {
                        console.error(`Emoji oluşturulurken bir hata oluştu: ${error}`);
                    }
                });

                // Emojilerin oluşturulduğunu bildir
                const successEmbed = new EmbedBuilder()
                    .setColor(0x2B2D31)
                    .setDescription("Emojiler başarıyla oluşturuldu.");
                message.channel.send({ embeds: [successEmbed] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0)
                message.reply({ content: 'İşlem zaman aşımına uğradı, lütfen tekrar deneyin.', components: [] });
        });
    }
};
