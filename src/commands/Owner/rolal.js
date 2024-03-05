const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const data = require('../../../data.json');
const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "rolal",
    aliases: [],
    cooldown: 0,
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });
        const giveawayButton = new ButtonBuilder()
            .setCustomId('giveawayRole')
            .setLabel('Çekiliş Katılımcısı')
            .setStyle('Primary');

        const eventButton = new ButtonBuilder()
            .setCustomId('eventRole')
            .setLabel('Etkinlik Katılımcısı')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(giveawayButton, eventButton);

        const reply = await message.reply({ content: `Herkese merhaba **${message.guild.name}** Ailesi Bildiğiniz üzere sunucumuzda birçok **Çekiliş**,**Konser**,**Etkinlik**,**Oyun** günleri düzenlenicektir.
        \n*__everyone__*,*__here__* gibi topluluğu rahatsız edicek etiketleri atmayacağız **Etkinlik** ve **Çekilişlerden** Haberdar olmak için asaşğıda ki butonlardan ilgili rolü alabilirsiniz.
        \n**▪︎** **Oyun** & **Etkinlik** günlerinden haberdar olmak için <@&${data.katılım.roleetkinkatılım}> Rolünü alabilirsiniz.
        \n**▪︎** **Konser** & **Çekiliş** günlerinden haberdar olmak için <@&${data.katılım.roleçekilkatılım}> Rolünü alabilirsiniz.
        `, components: [row] });

        const filter = i => (i.customId === 'giveawayRole' || i.customId === 'eventRole');

        const collector = reply.createMessageComponentCollector({
            filter,
        });

        collector.on('collect', async i => {
            const role = i.customId === 'giveawayRole' ? message.guild.roles.cache.find(role => role.name === 'Çekiliş Katılımcısı') :
                         i.customId === 'eventRole' ? message.guild.roles.cache.find(role => role.name === 'Etkinlik Katılımcısı') :
                         null;
            if (role) {
                try {
                    await i.member.roles.add(role);
                    await i.reply({ content: `${role.name} rolü başarıyla verildi.`, ephemeral: true });
                } catch (error) {
                    console.error("Rol verme hatası:", error);
                    await i.reply({ content: "Rol verilirken bir hata oluştu.", ephemeral: true });
                }
            } else {
                await i.reply({ content: "İlgili rol bulunamadı.", ephemeral: true });
            }
        });
    }
};
