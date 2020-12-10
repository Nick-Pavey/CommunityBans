Twitch Bot
> A bare bones example on how to add a [Twitch](https://twitch.tv) bot to your Twitch chat using [tmi.js](https://tmijs.org/) and **Glitch**.

What you need
---------------- - -  -
 - First, your own [Twitch.tv account](https://twitch.tv/signup).
 - Log out (or use different browser) after creating your account.
 - Create an [account](https://twitch.tv/signup) for your bot to use.
 - Stay logged in to the bot account and continue to the next step.
 - Visit [TwitchApps/TMI](https://twitchapps.com/tmi/) to generate and oauth token
 - Edit .env file add the USERNAME and oauth PASSWORD for your bot.
 - After a moment or two you should see your bot join [twitch.tv/shinbot/chat](twitch.tv/shinbot/chat)
 - Edit index.js line 26 `channels: ["shinbot"]` to point to your channel, this is the channel you want to bot to join.
 - I have included two example commands both currently pointing to the `shinbot` channel you should update those too. To add more simply extend out the switch statement. For further documentation see [tmi.js](https://docs.tmijs.org/).
 - Follow me on [Twitch](https://twitch.tv/shindakun).