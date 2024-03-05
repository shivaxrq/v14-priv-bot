const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "say",
    run: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: "Bu komutu kullanma yetkiniz bulunmamaktadır." });
        }


        var takviye = message.guild.premiumSubscriptionCount;
        var TotalMember = message.guild.memberCount;
        var AktifMember = message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size;
        var sesli = message.guild.members.cache.filter((x) => x.voice.channel).size;
        var tag = message.guild.members.cache.filter(u => u.user.username.includes("")); 


        const detailEmbed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle("Sunucu Detaylı Verisi")
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
            .setDescription(`
\`\`\`fix
Aşağıda Sunucu Verilerini Daha Detaylı Görebilirsiniz.
\`\`\`
       \`•\` **Sunucunun Toplam Üye Sayısı :** \`${TotalMember}\`
       \`•\` **Sunucudaki Toplam Aktif Kullanıcı Sayısı :** \`${AktifMember}\`
       \`•\` **Sesli Kanallardaki Toplam Üye Sayısı :** \`${sesli}\`
       \`•\` **Sesli Kanallardaki Toplam Bot Sayısı :** \`${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size}\`
       \`•\` **Sunucunun Boost Sayısı :** \`${takviye}\`
       \`•\` **Sunucudaki Bot Sayısı :** \`${message.guild.members.cache.filter(x => x.user.bot).size}\`
\`\`\`fix
Aşağıda Saate Göre Giriş İstatistiği Verilmiştir.
\`\`\`
       \`•\` **1 saat :** \`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60).size)}\` kullanıcı giriş yapmış.
       \`•\` **1 gün :** \`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60 * 24).size)}\` kullanıcı giriş yapmış.
       \`•\` **1 hafta :** \`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60 * 24 * 7).size)}\` kullanıcı giriş yapmış.
       \`•\` **1 ay :**\`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60 * 24 * 30).size)}\` kullanıcı giriş yapmış.
      `);

        const refreshButton = new ButtonBuilder()
            .setCustomId("refresh_button")
            .setLabel("♻️ Yenile")
            .setStyle("Secondary");


        const row = new ActionRowBuilder()
            .addComponents(refreshButton);


        const reply = await message.channel.send({ embeds: [detailEmbed], components: [row] });


        const filter = i => i.customId === 'refresh_button' && i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async interaction => {
            const refreshedEmbed = new EmbedBuilder()
                .setColor(0x2B2D31)
                .setTitle("Sunucu Detaylı Verisi")
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
                .setDescription(`
\`\`\`fix
Aşağıda Sunucu Verilerini Daha Detaylı Görebilirsiniz.
\`\`\`
       \`•\` **Sunucunun Toplam Üye Sayısı :** \`${TotalMember}\`
       \`•\` **Sunucudaki Toplam Aktif Kullanıcı Sayısı :** \`${AktifMember}\`
       \`•\` **Sesli Kanallardaki Toplam Üye Sayısı :** \`${sesli}\`
       \`•\` **Sesli Kanallardaki Toplam Bot Sayısı :** \`${message.guild.members.cache.filter(x => x.user.bot && x.voice.channel).size}\`
       \`•\` **Sunucunun Boost Sayısı :** \`${takviye}\`
       \`•\` **Sunucudaki Bot Sayısı :** \`${message.guild.members.cache.filter(x => x.user.bot).size}\`
\`\`\`fix
Aşağıda Saate Göre Giriş İstatistiği Verilmiştir.
\`\`\`
       \`•\` **1 saat :** \`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60).size)}\` kullanıcı giriş yapmış.
       \`•\` **1 gün :** \`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60 * 24).size)}\` kullanıcı giriş yapmış.
       \`•\` **1 hafta :** \`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60 * 24 * 7).size)}\` kullanıcı giriş yapmış.
       \`•\` **1 ay :**\`${(message.guild.members.cache.filter(ancient => (new Date().getTime() - ancient.joinedTimestamp) < 1000 * 60 * 60 * 24 * 30).size)}\` kullanıcı giriş yapmış.
      `);


            reply.edit({ embeds: [refreshedEmbed] });
        });
    }
};
