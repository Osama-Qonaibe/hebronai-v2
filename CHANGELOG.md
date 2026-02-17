# Changelog

## [2.2.3](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v2.2.2...hebronai-v2-v2.2.3) (2026-02-17)


### Bug Fixes

* use useLocale hook instead of useParams for routing ([7146ff5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7146ff5f9312d2fa91ce635365a3e13d252f2ea7))

## [2.2.2](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v2.2.1...hebronai-v2-v2.2.2) (2026-02-17)


### Bug Fixes

* make forgot password link clickable outside label ([5a45d6d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5a45d6d38d15a9300ec18b6d0a4096b7315fad6d)) by @Osama-Qonaibe
* use locale-aware routing for forgot password link ([c7ef982](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c7ef9827800dceb5aaa5b7c9f2f4bd38bf43e04e)) by @Osama-Qonaibe

## [2.2.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v2.2.0...hebronai-v2-v2.2.1) (2026-02-17)


### Bug Fixes

* enable forgot password link for all users including first user ([dae6689](https://github.com/Osama-Qonaibe/hebronai-v2/commit/dae66890774a2db6d310ba0ee517fbe28fa2a076)) by @Osama-Qonaibe

## [2.2.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v2.1.1...hebronai-v2-v2.2.0) (2026-02-17)


### Features

* add manual payment option for direct admin approval ([028410e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/028410e52dfde7c51ad3eae5f527c56f18057fad)) by @Osama-Qonaibe
* add PWA install prompt component ([7dbd836](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7dbd836eb76aa8b7ffcc8c41f11aa0a06cbdcb62)) by @Osama-Qonaibe
* add PWA install prompt to layout ([239f36a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/239f36a48d90bcc369035daa3d86e7c7d2dd66ea)) by @Osama-Qonaibe
* add subscription system migration ([975d13a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/975d13a18168f00e14cab0c0fd97ea9df66c4e0f)) by @Osama-Qonaibe


### Bug Fixes

* add missing Admin.Subscriptions.description translation ([2088df8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2088df86d2b5ec9d07547dad89d2f1a8d85e3bfc)) by @Osama-Qonaibe
* grant admin full model access ([f7e6dfa](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f7e6dfa0453c03e430cf832869445baa1c99ac11)) by @Osama-Qonaibe
* handle API response format for authenticated users ([17505cb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/17505cb663107a57f12fe7b5a4ffd0b96a6fde24)) by @Osama-Qonaibe
* improve mobile responsiveness for RTL ([b0e0a4f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b0e0a4f976a6280050c876a34ddc821086f2de00)) by @Osama-Qonaibe
* reload user data from DB for accurate subscription info ([f9f0ed2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f9f0ed2afc35fa65d6957ea4235938352c1774ab)) by @Osama-Qonaibe
* remove unused ApiResponse type ([cf7a60f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cf7a60f5ccce166f9f9351ca8ad36d33f56f1944)) by @Osama-Qonaibe
* remove unused ExternalLink import ([2c158da](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2c158dab5ebf821b2125f6bb854c9cd621ca1a21)) by @Osama-Qonaibe
* replace window.open with location.href for PWA compatibility ([339aa52](https://github.com/Osama-Qonaibe/hebronai-v2/commit/339aa52115207b08df10017705ddca3cb3157245)) by @Osama-Qonaibe
* send request first, then open payment gateway ([779692f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/779692ffe8441fe6f7e2a104766a4e4d47cce0da)) by @Osama-Qonaibe
* update manifest for Arabic RTL PWA ([977c2f7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/977c2f7421bf99fbbc866f7a173d70f89e0da0a0)) by @Osama-Qonaibe
* use sonner toast instead of non-existent use-toast ([28e2753](https://github.com/Osama-Qonaibe/hebronai-v2/commit/28e27537c1c72c36921c16cb28c1d54bc75f61d5)) by @Osama-Qonaibe

## [2.1.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v2.1.0...hebronai-v2-v2.1.1) (2026-02-17)


### Bug Fixes

* change app name from 'Chat Bot' to 'HebronAI' ([474162d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/474162dc7ea5dfc4f321f17161102664e035d279)) by @Osama-Qonaibe

## [2.1.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v2.0.0...hebronai-v2-v2.1.0) (2026-02-17)


### Features

* prevent duplicate subscription requests and disable upgrade buttons ([be5728f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/be5728fdbb5fe56d4575f246aed72789fe1c4e40)) by @CJWTRUST


### Bug Fixes

* add array validation for providers in useMemo to prevent crash ([eaf91f6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eaf91f62ccd696797b9893c8a5712bc77e008c3b)) by @CJWTRUST
* add array validation for providers.map in select-model ([9b5acd6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9b5acd681e6c744b1f22d348827ac268c2f595f1)) by @CJWTRUST
* add missing Arabic translations for Admin.Subscriptions and pending request messages ([17b20b1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/17b20b1ee8f149b97c30b23a6f0c458a130bf413)) by @CJWTRUST
* add null checks for PLANS to prevent TypeError crash ([bf34bac](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bf34bac35a2d8dfc365326e2dcada394493fbc4e)) by @CJWTRUST
* comprehensive providers validation - prevent all array crashes ([864f393](https://github.com/Osama-Qonaibe/hebronai-v2/commit/864f393be283f45f746e036110aef0e0957d2fa4)) by @CJWTRUST
* critical subscription workflow fixes ([ec318ca](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec318caa147eb3537d88ac7c5ef0346fbfec614e)) by @CJWTRUST


### Reverts

* restore subscription workflow - fix payment dialog and database caching ([87f303c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/87f303c645ab2b57dc294f903140ed3281edf43d)) by @Osama-Qonaibe

## [2.0.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.14.0...hebronai-v2-v2.0.0) (2026-02-16)


### ⚠ BREAKING CHANGES

* Plan names updated from 'premium' to 'pro' and added 'enterprise' tier

### Features

* implement comprehensive subscription system with model access control and usage limits ([d6c1025](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d6c10259e83f12d468d4868137df1896d7a618d3)) by @CJWTRUST


### Bug Fixes

* replace premium with pro and enterprise in admin repository stats ([ebf4e43](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ebf4e4348ef7ce6934123bf0fe45ccae0644cf43)) by @CJWTRUST
* update BasicUser type to support pro and enterprise plans ([81be81b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/81be81b82a5e78a421a83200692e055c29d2762f)) by @CJWTRUST

## [1.14.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.13.1...hebronai-v2-v1.14.0) (2026-02-16)


### Features

* Add PWA support with manifest and service worker ([f23e27c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f23e27ca2928fcf94a5704c26c5ffa081ed226a2)) by @CJWTRUST
* Create icons folder for PWA setup ([f0a0b7d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f0a0b7d7d072c057f9fa33001a1624736ccd7314)) by @CJWTRUST

## [1.13.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.13.0...hebronai-v2-v1.13.1) (2026-02-16)


### Bug Fixes

* Add English translations for Subscription page ([55390a5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/55390a5d57920d03e7e3b7bbbd8ad40efe268f85)) by @CJWTRUST

## [1.13.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.12.0...hebronai-v2-v1.13.0) (2026-02-16)


### Features

* Add Arabic translations for subscription page ([96dc2db](https://github.com/Osama-Qonaibe/hebronai-v2/commit/96dc2db2187d952817ef63edfcbc78483b7221d3)) by @CJWTRUST
* add full Arabic language support with RTL ([e8ac5ba](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e8ac5bafb92316f9b385ce6120cd9b447fb00138)) by @Osama-Qonaibe
* Add Full Arabic Language Support with RTL ([01d69b4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/01d69b46b9074d34e1777495566ad39dfe6b4f99)) by @Osama-Qonaibe
* Add professional RTL support with locale middleware ([52254f4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/52254f4e1c32e23f86f0c99d554ed0b317f816d7)) by @Osama-Qonaibe
* Complete Arabic translation for subscription page ([8bf3ba6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8bf3ba6b414867dd9176eafd496826be0880ee9e)) by @CJWTRUST


### Bug Fixes

* add Cairo font for proper Arabic text rendering ([526f4be](https://github.com/Osama-Qonaibe/hebronai-v2/commit/526f4bee670aa738d1da14b0bfa23461c1e32fc4)) by @Osama-Qonaibe
* Auto-detect RTL and position sidebar on right side ([2c4b5da](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2c4b5da72627023be5fdb6ff059e9cdc505ad10a)) by @Osama-Qonaibe
* Complete RTL overhaul - clean CSS, fix FlipWords, restore button functionality ([a11fd24](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a11fd24d9e71ba9f1b4238f55784f2c631c52227)) by @Osama-Qonaibe
* Enhance RTL Support for Arabic Interface ([dd0070d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/dd0070dfcd86d4e58c3d213fa8ec8275bfcc97b7)) by @Osama-Qonaibe
* enhance RTL support for sidebar and UI components ([eec00a1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eec00a15508c55e1f908bbec333fef8887a554b1)) by @Osama-Qonaibe
* escape CSS selectors for peer-data attributes ([8bcb0b9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8bcb0b92b0fba0c9ce0f00686f8cfbf81844a651)) by @Osama-Qonaibe
* improve RTL positioning for absolute elements ([a769e5c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a769e5cfddd008bc2e7e549571972a6b2a539d67)) by @Osama-Qonaibe
* Improve sidebar RTL detection for E2E test stability ([a0b04d3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a0b04d344d8c1f7df095b0bc0e9a2811a75d7acd)) by @CJWTRUST
* Improve Sidebar RTL positioning with correct data-slot selectors ([312efb4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/312efb44f4c7d0711ac6e73774b43f8341b341ba)) by @Osama-Qonaibe
* Locale handling now works on all pages including sign-in ([78f5a57](https://github.com/Osama-Qonaibe/hebronai-v2/commit/78f5a57c04a3c794ad37ab77d1751b00132bf3bb)) by @Osama-Qonaibe
* Make REDIS_URL validation handle empty strings in E2E tests ([3f5dce6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3f5dce69b0614199f0f8cf188ab91141ccd4e506)) by @CJWTRUST
* phase 1 improvements - linting, security, env validation, biome v2 ([ba27d79](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ba27d7915e656cab33f3f9d8e4f41fc7eb51b255)) by @Osama-Qonaibe
* phase 1 improvements - linting, security, env validation, biome v2 ([2bd497c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2bd497c75f0a46661a317c0d118e37109890f317)) by @Osama-Qonaibe
* Properly handle Arabic text in FlipWords component - display whole words instead of splitting into letters ([d0393e7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d0393e765c91c81a3fcb3c930fb4b4d09a9c6284)) by @Osama-Qonaibe
* remove overly broad RTL CSS rules breaking interactivity ([cde4d1d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cde4d1d9b199cbc6a1dafcff96438710c19b8192)) by @Osama-Qonaibe
* Remove unused useTranslations import from subscription page ([32df81a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/32df81a0cb0051587900711b1ebaefe26154628f)) by @CJWTRUST

## [1.12.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.11.0...hebronai-v2-v1.12.0) (2026-02-11)


### Features

* add subscription fields to User schema ([504c56b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/504c56bb7aa80b3f348a900d00bdea69134ffd73)) by @Osama-Qonaibe


### Bug Fixes

* Add proper type casting for subscription fields ([7bb5a2a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7bb5a2a6b3f344c42622450a910baed8d06b96f7)) by @Osama-Qonaibe
* add subscription fields to BasicUser type ([0566ad5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0566ad54ee66f80ea7e3369a54da6184508af477)) by @Osama-Qonaibe
* add type assertion for session.user in chat layout ([50a79e5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/50a79e575b0c990004ac6055a428324bdadd8d15)) by @Osama-Qonaibe
* add type assertion for session.user in mcp page ([99a700d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/99a700d8099914a7eaced5dce6c2d19242e5e836)) by @Osama-Qonaibe
* add type assertion for user in signUpAction ([1880348](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1880348b34f3ffc2007da8ec42f059842d947b65)) by @Osama-Qonaibe
* Handle null planExpiresAt with conditional ([a124a51](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a124a5121718d3f7078a621d28291dc4e0d15381)) by @Osama-Qonaibe
* make subscription fields optional in BasicUser ([122b14b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/122b14bcffc784b813e45c75f413ddc7062afa90)) by @Osama-Qonaibe
* Make user fields nullable in AdminSubscriptionRequest ([eb0fca1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eb0fca14985ff4d10b9b68392ea248a0ea688910)) by @Osama-Qonaibe
* Match SubscriptionPlan type (free, basic, pro, enterprise) ([2de9460](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2de9460185be73911d9cfa013e74ec96b9181f02)) by @Osama-Qonaibe
* Match SubscriptionStatus type with server definition ([707ee6d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/707ee6d735b44eabc88a6da143ab5460b8c1dd21)) by @Osama-Qonaibe
* Pay button now sends request + opens payment gateway ([53f402e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/53f402e8fbe01bed0a8cca5a92a5c918f687f28b)) by @Osama-Qonaibe
* Remove duplicate AdminSubscriptionRequest interface - use from types ([067da95](https://github.com/Osama-Qonaibe/hebronai-v2/commit/067da95f03b8343edcb03d0167a542ddc90b0b6f)) by @Osama-Qonaibe
* Remove manual payment + add submit for bank transfer ([0deb5f4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0deb5f467fa7477f1f535fb929e58c7001316fb6)) by @Osama-Qonaibe
* Remove server imports from client component ([e5d30df](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e5d30dff450b306ab0686a9dc9ab07f2c210c996)) by @Osama-Qonaibe
* Remove toast dependency, use simple alerts ([829e817](https://github.com/Osama-Qonaibe/hebronai-v2/commit/829e81704ed3afff6b397be3a8d889565c66d1ed)) by @Osama-Qonaibe
* Remove unused 'and' import ([514bdcb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/514bdcbf0d1306262e14f77c2b97e3ede3679eaf)) by @Osama-Qonaibe
* Remove unused import UserSessionUser ([2a79bce](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2a79bceb2649d5447acf833cf915295e7f597a80)) by @Osama-Qonaibe
* Rename conflicting variable name ([804c6d1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/804c6d1a0073fae3fa1d4b5715b2ffcb58acaff6)) by @Osama-Qonaibe
* Use correct import path app-types/admin ([f03784f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f03784f9b3c08e0066f0995a29511c8032886eac)) by @Osama-Qonaibe
* Use correct method name getUserRequests ([2d3c386](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2d3c38643fdcda3766c0fdf89464835ebb3d2525)) by @Osama-Qonaibe
* Use correct UserTable field names (plan, planStatus) ([571ae28](https://github.com/Osama-Qonaibe/hebronai-v2/commit/571ae28e63d6749761113be5d041b96d898bbf37)) by @Osama-Qonaibe
* Use correct ZodError.issues property ([7af45ec](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7af45ec37c990b07d3f7cbf3ca7ff3bde6f382ec)) by @Osama-Qonaibe
* Use proper type casting for subscription fields ([d8a3666](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d8a366637e4fae19617bbe49c3fb0758a25b020e)) by @Osama-Qonaibe
* Use userRepository instead of direct db access ([e9ff352](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e9ff35239cd3a28b9c233ad9a9846b57fa306801)) by @Osama-Qonaibe

## [1.11.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.10.0...hebronai-v2-v1.11.0) (2026-01-31)


### Features

* add OpenRouter Auto Router (smart routing) ([8968ca4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8968ca437ac2ae348d4c8d89906a2d818df91b20)) by @Osama-Qonaibe

## [1.10.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.9.0...hebronai-v2-v1.10.0) (2026-01-31)


### Features

* replace OpenRouter free with premium models ([9b37dbd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9b37dbda375b4caec98d958d9ccd4050c30004f4)) by @Osama-Qonaibe


### Bug Fixes

* correct OpenRouter free model names ([0ea93e3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0ea93e392d5dc3544ea5424b2be36fe520790357)) by @Osama-Qonaibe

## [1.9.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.8.0...hebronai-v2-v1.9.0) (2026-01-31)


### Features

* add 25+ free OpenRouter models (newest first) ([b73ee43](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b73ee43de70fad98f91ea5389176c6099b4467da)) by @Osama-Qonaibe

## [1.8.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.7.0...hebronai-v2-v1.8.0) (2026-01-31)


### Features

* add 13 new OpenAI models (chat, image, video, audio) ([d64e50b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d64e50b5cdbef2612434dcefa8e77a6cdd0657e2)) by @Osama-Qonaibe

## [1.7.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.6.2...hebronai-v2-v1.7.0) (2026-01-31)


### Features

* add 3 additional Ollama Cloud models ([649c1b8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/649c1b8f33212286535ad59b82ab573c40e316a2)) by @Osama-Qonaibe

## [1.6.2](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.6.1...hebronai-v2-v1.6.2) (2026-01-31)


### Bug Fixes

* use correct Ollama Cloud model names ([ce70b4f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ce70b4f6f8e6d9e35de5faa43d5a8a4f46a7e67d)) by @Osama-Qonaibe

## [1.6.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.6.0...hebronai-v2-v1.6.1) (2026-01-31)


### Bug Fixes

* correct XAI_FILE_TYPES typo ([275ab60](https://github.com/Osama-Qonaibe/hebronai-v2/commit/275ab60b901185f8e1b7f9e9043516845957a247)) by @Osama-Qonaibe
* remove unsupported Ollama Cloud models ([c819ef8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c819ef81a1e0fad4c107fbd77dce1b868c4bce7c)) by @Osama-Qonaibe

## [1.6.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v1.5.2...hebronai-v2-v1.6.0) (2026-01-31)


### Features

* add Ollama Cloud authentication support ([fcccaa5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/fcccaa52921a1d8f54b3d55da109b92f7e175ad7)) by @Osama-Qonaibe
* Add Ollama Cloud authentication support ([434c643](https://github.com/Osama-Qonaibe/hebronai-v2/commit/434c64323ae6bb5de0adcfebc62c520885fec66f)) by @Osama-Qonaibe


### Bug Fixes

* add config-file path to release-please action ([8637513](https://github.com/Osama-Qonaibe/hebronai-v2/commit/86375133112214a0ec589bb54b98161cd2bbf3b8)) by @Osama-Qonaibe

## 1.5.2 (2026-01-31)


### Features

* Add Azure OpenAI provider support with comprehensive testing ([#189](https://github.com/Osama-Qonaibe/hebronai-v2/issues/189)) ([edad917](https://github.com/Osama-Qonaibe/hebronai-v2/commit/edad91707d49fcb5d3bd244a77fbaae86527742a)) by @shukyr
* add bot name preference to user settings ([f4aa588](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f4aa5885d0be06cc21149d09e604c781e551ec4a)) by @cgoinglove
* add chat-related translations and enhance UI components with animations and improved accessibility ([c254c84](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c254c8472f6b59a9d79a84cae892a77bcc8aefcb)) by @cgoinglove
* add common UI translations and enhance project and thread management components with improved localization ([bf05c55](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bf05c55cd9c5878d86fac079a8856bfe257e479e)) by @cgoinglove
* add DISABLE_EMAIL_SIGN_UP to control email and OAuth signups separately ([#331](https://github.com/Osama-Qonaibe/hebronai-v2/issues/331)) ([2811cf3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2811cf3dbcce03da467cd958587473326dab9cc1)) by @mrjasonroy
* add husky ([067d58d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/067d58dbbb58428bace3a71769c5a7dcea86bcd5)) by @brrock
* add husky for formatting and checking commits  ([#71](https://github.com/Osama-Qonaibe/hebronai-v2/issues/71)) ([a379cd3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a379cd3e869b5caab5bcaf3b03f5607021f988ef)) by @cgoinglove
* Add js-execution tool and  bug fixes(tool call) ([#148](https://github.com/Osama-Qonaibe/hebronai-v2/issues/148)) ([12b18a1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/12b18a1cf31a17e565eddc05764b5bd2d0b0edee)) by @cgoinglove
* add language translation guidelines and instructions for contributing new languages to the chatbot ([3bb8fd3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3bb8fd3d332e4bf65d87b8ca8b92c190500f308b)) by @cgoinglove
* add LaTeX/TeX math equation rendering support ([#318](https://github.com/Osama-Qonaibe/hebronai-v2/issues/318)) ([c0a8b5b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c0a8b5b9b28599716013c83cac03fa5745ffd403)) by @jezweb
* add lint-staged and remove commitlint ([67988b8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/67988b8ad29fba4fc4bfee93bf9fe2e9d83b7dc0)) by @brrock
* add logging for base URL configuration in auth server and update baseURL assignment for better clarity ([6ca13fd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6ca13fdc8626c054b67c93f1a0c8994d413be411)) by @cgoinglove
* add new translations for project and chat management, enhance sidebar components with improved UI interactions, and implement dynamic project and chat visibility toggles ([5319d9c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5319d9c9764467cc74b08a4cc8d7a60fb384bad2)) by @cgoinglove
* add new translations for reporting issues and joining the community, remove unused language selection component, and enhance theme selection functionality in the sidebar ([314973c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/314973ca033ce5c5bf9fc978c5fe74094faaa6e0)) by @cgoinglove
* add norwegian translation ([#341](https://github.com/Osama-Qonaibe/hebronai-v2/issues/341)) ([64f88cc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/64f88cc37fab0613c0711d9b30bff84daae74839)) by @hakonharnes
* add openAI compatible provider support ([#92](https://github.com/Osama-Qonaibe/hebronai-v2/issues/92)) ([6682c9a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6682c9a320aff9d91912489661d27ae9bb0f4440)) by @brrock
* add pink themes ([2e43cc6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2e43cc628ad0ea159865a4cf633821fa35792d38)) by @brrock
* add Python execution tool and integrate Pyodide support ([#176](https://github.com/Osama-Qonaibe/hebronai-v2/issues/176)) ([de2cf7b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/de2cf7b66444fe64791ed142216277a5f2cdc551)) by @cgoinglove
* add qwen3 coder to models file for openrouter ([#206](https://github.com/Osama-Qonaibe/hebronai-v2/issues/206)) ([3731d00](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3731d007100ac36a814704f8bde8398ce1378a4e)) by @brrock
* add sequential thinking tool and enhance UI components ([230f4a7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/230f4a7cd94fa88052069231e7bb6a5c9a18ff6e)) by @cgoinglove
* add sequential thinking tool and enhance UI components ([#183](https://github.com/Osama-Qonaibe/hebronai-v2/issues/183)) ([5bcbde2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5bcbde2de776b17c3cc1f47f4968b13e22fc65b2)) by @cgoinglove
* add Spanish, French, Japanese, and Chinese language support with UI improvements ([#74](https://github.com/Osama-Qonaibe/hebronai-v2/issues/74)) ([e34d43d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e34d43df78767518f0379a434f8ffb1808b17e17)) by @cgoing-bot
* Add support for Streamable HTTP Transport [#56](https://github.com/Osama-Qonaibe/hebronai-v2/issues/56) ([#64](https://github.com/Osama-Qonaibe/hebronai-v2/issues/64)) ([8783943](https://github.com/Osama-Qonaibe/hebronai-v2/commit/878394337e3b490ec2d17bcc302f38c695108d73)) by @cgoinglove
* Add web search and content extraction tools using Tavily API ([#126](https://github.com/Osama-Qonaibe/hebronai-v2/issues/126)) ([f7b4ea5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f7b4ea5828b33756a83dd881b9afa825796bf69f)) by @cgoing-bot
* admin and roles ([#270](https://github.com/Osama-Qonaibe/hebronai-v2/issues/270)) ([63bddca](https://github.com/Osama-Qonaibe/hebronai-v2/commit/63bddcaa4bc62bc85204a0982a06f2bed09fc5f5)) by @mrjasonroy
* agent sharing ([#226](https://github.com/Osama-Qonaibe/hebronai-v2/issues/226)) ([090dd8f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/090dd8f4bf4fb82beb2cd9bfa0b427425bbbf352)) by @mrjasonroy
* **agent:** agent and archive  ([#192](https://github.com/Osama-Qonaibe/hebronai-v2/issues/192)) ([c63ae17](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c63ae179363b66bfa4f4b5524bdf27b71166c299)) by @cgoinglove
* ai v5 ([#230](https://github.com/Osama-Qonaibe/hebronai-v2/issues/230)) ([0461879](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0461879740860055a278c96656328367980fa533)) by @cgoinglove
* **chat:** enable [@mention](https://github.com/mention) and tool click to trigger workflow execution in chat ([#122](https://github.com/Osama-Qonaibe/hebronai-v2/issues/122)) ([b4e7f02](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b4e7f022fa155ef70be2aee9228a4d1d2643bf10)) by @cgoing-bot
* credit contributors in releases and changelogs ([#104](https://github.com/Osama-Qonaibe/hebronai-v2/issues/104)) ([e0e4443](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e0e444382209a36f03b6e898f26ebd805032c306)) by @brrock
* enhance authentication UI and add Korean translations ([1389e0a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1389e0ab1e8e639cfa6f248001ffa2d9c13f6c47)) by @cgoinglove
* enhance localization by adding new translations for chat, project, and keyboard shortcuts, and improve UI components with dynamic text rendering ([d71997d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d71997dad6d685fa10099dd2e80d3e83aa403ecf)) by @cgoinglove
* enhance MCPClient transport handling with StreamableHTTPClientTransport and fallback to SSE ([c3413c3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c3413c3b6aa23e933bf27184c01aaf9a6c9bc333)) by @cgoinglove
* enhance PromptInput with new Lightbulb icon and tooltip for Think Mode ([1bf3ad7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1bf3ad71e40cf395c531a6526d4dc308881462c5)) by @cgoinglove
* enhance TemporaryChat component with improved shortcut key display and update AppHeader to remove GitHub link, streamline UI interactions in AppSidebarUser for reporting issues and joining community ([5cb31b5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5cb31b541ad55d19d216028c920202aa4900ec4a)) by @cgoinglove
* enhance TemporaryChat component with new instructions feature, add corresponding translations, and improve UI interactions in AppHeader for better user experience ([0c7be80](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0c7be8052e815a43dad4ea81da27beb4f84668c3)) by @cgoinglove
* export chat thread ([#278](https://github.com/Osama-Qonaibe/hebronai-v2/issues/278)) ([23e79cd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/23e79cd570c24bab0abc496eca639bfffcb6060b)) by @cgoinglove
* **file-storage:** image uploads, generate profile with ai ([#257](https://github.com/Osama-Qonaibe/hebronai-v2/issues/257)) ([46eb43f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/46eb43f84792d48c450f3853b48b24419f67c7a1)) by @brrock
* generate image Tool (Nano Banana) ([#284](https://github.com/Osama-Qonaibe/hebronai-v2/issues/284)) ([984ce66](https://github.com/Osama-Qonaibe/hebronai-v2/commit/984ce665ceef7225870f4eb751afaf65bf8a2dd4)) by @cgoinglove
* groq provider ([#268](https://github.com/Osama-Qonaibe/hebronai-v2/issues/268)) ([aef213d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aef213d2f9dd0255996cc4184b03425db243cd7b)) by @cgoinglove
* hide LLM providers without API keys in model selection ([#269](https://github.com/Osama-Qonaibe/hebronai-v2/issues/269)) ([63c15dd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/63c15dd386ea99b8fa56f7b6cb1e58e5779b525d)) by @cgoinglove
* **i18n:** add Arabic locale and make it default ([#4](https://github.com/Osama-Qonaibe/hebronai-v2/issues/4)) ([8ae3d9d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8ae3d9d93c5176513de7f5e06f66da9e366d7127)) by @Osama-Qonaibe
* implement cold start-like auto connection for MCP server and simplify status ([#73](https://github.com/Osama-Qonaibe/hebronai-v2/issues/73)) ([987c442](https://github.com/Osama-Qonaibe/hebronai-v2/commit/987c4425504d6772e0aefe08b4e1911e4cb285c1)) by @cgoing-bot
* implement language selection component and enhance authentication UI with improved translations and user prompts ([d97d891](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d97d891bc3d63b4a9ca0df829177e0368bc4a462)) by @cgoinglove
* implement sequential thinking mode in chat API and UI components ([8f4d945](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8f4d9452a73902455d362a3d2ff943e4b5757063)) by @cgoinglove
* implement speech system prompt and update voice chat options for enhanced user interaction ([5a33626](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5a336260899ab542407c3c26925a147c1a9bba11)) by @cgoinglove
* Implementation of PWA for much better UI on mobile  ([#252](https://github.com/Osama-Qonaibe/hebronai-v2/issues/252)) ([51e6eab](https://github.com/Osama-Qonaibe/hebronai-v2/commit/51e6eabcc34e1238a7536b5fffa433ba4ae4827a)) by @jaey-p
* improve authentication configuration and social login handling  ([#211](https://github.com/Osama-Qonaibe/hebronai-v2/issues/211)) ([cd25937](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cd25937020710138ab82458e70ea7f6cabfd03ca)) by @mrjasonroy
* improve markdown table styling ([#244](https://github.com/Osama-Qonaibe/hebronai-v2/issues/244)) ([7338e04](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7338e046196f72a7cc8ec7903593d94ecabcc05e)) by @hakonharnes
* introduce changesets for version management and fix OpenAI voice chat options bug ([#63](https://github.com/Osama-Qonaibe/hebronai-v2/issues/63)) ([9ae823b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9ae823b602f1ee20a9b9aeb9e3a88537084033b1)) by @cgoinglove
* introduce interactive table creation and enhance visualization tools ([#205](https://github.com/Osama-Qonaibe/hebronai-v2/issues/205)) ([623a736](https://github.com/Osama-Qonaibe/hebronai-v2/commit/623a736f6895b8737acaa06811088be2dc1d0b3c)) by @cgoing-bot
* Lazy Chat Title Generation: Save Empty Title First, Then Generate and Upsert in Parallel ([#162](https://github.com/Osama-Qonaibe/hebronai-v2/issues/162)) ([31dfd78](https://github.com/Osama-Qonaibe/hebronai-v2/commit/31dfd7802e33d8d4e91aae321c3d16a07fe42552)) by @cgoinglove
* **mcp:** oauth ([#208](https://github.com/Osama-Qonaibe/hebronai-v2/issues/208)) ([136aded](https://github.com/Osama-Qonaibe/hebronai-v2/commit/136aded6de716367380ff64c2452d1b4afe4aa7f)) by @cgoinglove
* openai image generate ([#287](https://github.com/Osama-Qonaibe/hebronai-v2/issues/287)) ([0deef6e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0deef6e8a83196afb1f44444ab2f13415de20e73)) by @cgoinglove
* Per User Custom instructions ([#86](https://github.com/Osama-Qonaibe/hebronai-v2/issues/86)) ([d45c968](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d45c9684adfb0d9b163c83f3bb63310eef572279)) by @vineetu
* publish container to GitHub registry ([#149](https://github.com/Osama-Qonaibe/hebronai-v2/issues/149)) ([9f03cbc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9f03cbc1d2890746f14919ebaad60f773b0a333d)) by @codingjoe
* realtime voice chatbot with MCP tools ([#50](https://github.com/Osama-Qonaibe/hebronai-v2/issues/50)) ([cf13e9d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cf13e9df24eded1fc0e6fc8e44f728a44f6bc9d3)) by @cgoinglove
* refactor chat preferences and shortcuts handling by replacing ShortcutsProvider with AppPopupProvider, update state management for temporary chat, and enhance keyboard shortcut functionality in related components ([84070d5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/84070d5d31922a85ab2f322216d5c79da0dc2f74)) by @cgoinglove
* **releases:** add debug logging to the add authors and update release step ([#105](https://github.com/Osama-Qonaibe/hebronai-v2/issues/105)) ([c855a6a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c855a6a94c49dfd93c9a8d1d0932aeda36bd6c7e)) by @brrock
* remove experimental caching option from Next.js config, add deepmerge dependency, and enhance message handling in i18n request for improved localization ([c1d3e3b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c1d3e3b1501ebdac2b2c7f169ddc33cf95f3d6f4)) by @cgoinglove
* s3 storage and richer file support ([#301](https://github.com/Osama-Qonaibe/hebronai-v2/issues/301)) ([051a974](https://github.com/Osama-Qonaibe/hebronai-v2/commit/051a9740a6ecf774bfead9ce327c376ea5b279a5)) by @mrjasonroy
* set maxTokens to 30 in generateTitleFromUserMessageAction for improved title generation ([7dde3f1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7dde3f156d60488488862967b40d81aa02a29955)) by @cgoinglove
* Shortcuts Info ([6a5d71f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6a5d71f62042663f11bcc43671af73643167da78)) by @cgoinglove
* start i18n ([a9457d5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a9457d5d8933a43518a1e4c83114124aaa2dda2e)) by @cgoinglove
* tsconfig.tsbuildinfo 디렉토리를 기본 정리 목록에 추가 ([62ab4d8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/62ab4d8d5df2e8047756d746c9d8e2b1ff8c09c4)) by @cgoinglove
* update MCP server UI and translations for improved user experience ([1e2fd31](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1e2fd31f8804669fbcf55a4c54ccf0194a7e797c)) by @cgoinglove
* update mention ux ([#161](https://github.com/Osama-Qonaibe/hebronai-v2/issues/161)) ([7ceb9c6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7ceb9c69c32de25d523a4d14623b25a34ffb3c9d)) by @cgoinglove
* **voice-chat:** binding agent tools ([#275](https://github.com/Osama-Qonaibe/hebronai-v2/issues/275)) ([ed45e82](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ed45e822eb36447f2a02ef3aa69eeec88009e357)) by @cgoinglove
* web-search with images ([bea76b3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bea76b3a544d4cf5584fa29e5c509b0aee1d4fee)) by @cgoinglove
* **web-search:** replace Tavily API with Exa AI integration ([#204](https://github.com/Osama-Qonaibe/hebronai-v2/issues/204)) ([7140487](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7140487dcdadb6c5cb6af08f92b06d42411f7168)) by @cgoing-bot
* workflow beta ([#100](https://github.com/Osama-Qonaibe/hebronai-v2/issues/100)) ([2f5ada2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2f5ada2a66e8e3cd249094be9d28983e4331d3a1)) by @cgoing-bot
* **workflow:** add auto layout feature for workflow nodes and update UI messages ([0cfbffd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0cfbffd631c9ae5c6ed57d47ca5f34b9acbb257d)) by @cgoinglove
* **workflow:** Add HTTP and Template nodes with LLM structured output supportWorkflow node ([#117](https://github.com/Osama-Qonaibe/hebronai-v2/issues/117)) ([10ec438](https://github.com/Osama-Qonaibe/hebronai-v2/commit/10ec438f13849f0745e7fab652cdd7cef8e97ab6)) by @cgoing-bot
* **workflow:** add HTTP node configuration and execution support ([7d2f65f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7d2f65fe4f0fdaae58ca2a69abb04abee3111c60)) by @cgoinglove
* **workflow:** stable workflow  ( add example workflow : baby-research ) ([#137](https://github.com/Osama-Qonaibe/hebronai-v2/issues/137)) ([c38a7ea](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c38a7ea748cdb117a4d0f4b886e3d8257a135956)) by @cgoinglove


### Bug Fixes

* .next 디렉토리 정리 명령어 제거 ([3387ed5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3387ed51cf24b125a9039147bf14d513d0e9c2bc)) by @cgoinglove
* [#111](https://github.com/Osama-Qonaibe/hebronai-v2/issues/111)  prevent MCP server disconnection during long-running tool calls ([#238](https://github.com/Osama-Qonaibe/hebronai-v2/issues/238)) ([b5bb3dc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b5bb3dc40a025648ecd78f547e0e1a2edd8681ca)) by @cgoinglove
* Add .next cleanup to postinstall and fix db-migrate exit handling ([#272](https://github.com/Osama-Qonaibe/hebronai-v2/issues/272)) ([15ff34d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/15ff34d6a8a4c2c968ff08f9dcd6d87b7c85f652)) by @cgoinglove
* add POST endpoint for MCP client saving with session validation ([fa005aa](https://github.com/Osama-Qonaibe/hebronai-v2/commit/fa005aaecbf1f8d9279f5b4ce5ba85343e18202b)) by @cgoinglove
* add release-please manifest file ([9d2d9a5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9d2d9a51ca2d007f19dcf3dac5e1a3ee8721d379)) by @Osama-Qonaibe
* **agent:** improve agent loading logic and validation handling in EditAgent component [#198](https://github.com/Osama-Qonaibe/hebronai-v2/issues/198) ([ec034ab](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec034ab51dfc656d7378eca1e2b4dc94fbb67863)) by @cgoinglove
* **agent:** update description field to allow nullish values in ChatMentionSchema ([3e4532d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3e4532d4c7b561ad03836c743eefb7cd35fe9e74)) by @cgoinglove
* **api:** handle error case in chat route by using orElse for unwrap ([25580a2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/25580a2a9f6c9fbc4abc29fee362dc4b4f27f9b4)) by @cgoinglove
* Apply DISABLE_SIGN_UP to OAuth providers ([#282](https://github.com/Osama-Qonaibe/hebronai-v2/issues/282)) ([bcc0db8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bcc0db8eb81997e54e8904e64fc76229fbfc1338)) by @cgoing-bot
* blur prompt-input after submit to collapse mobile keyboard ([#337](https://github.com/Osama-Qonaibe/hebronai-v2/issues/337)) ([aec3530](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aec35300c1ca7269aa5086a95f1a4f480b2564c7)) by @theuargb
* bug(LineChart): series are incorrectly represented [#165](https://github.com/Osama-Qonaibe/hebronai-v2/issues/165) ([4e4905c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4e4905c0f7f6a3eca73ea2ac06f718fa29b0f821)) by @cgoinglove
* **chat:** prevent infinite MCP tool call loop by precomputing toolChoice ([#49](https://github.com/Osama-Qonaibe/hebronai-v2/issues/49)) ([ba7673b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ba7673becd9eaa6acdcfb36a05997e14ab597cc5)) by @cgoinglove
* clean changelog and stop duplicate attributions in the changelog file ([#119](https://github.com/Osama-Qonaibe/hebronai-v2/issues/119)) ([aa970b6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aa970b6a2d39ac1f0ca22db761dd452e3c7a5542)) by @brrock
* css ([6a2f8e9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6a2f8e9f19c9279fdc1cb5dfd2d8d9cfb63d89e2)) by @brrock
* Enhance component styles and configurations ([a7284f1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a7284f12ca02ee29f7da4d57e4fe6e8c6ecb2dfc)) by @cgoinglove
* enhance error handling in chat bot component ([1519799](https://github.com/Osama-Qonaibe/hebronai-v2/commit/15197996ba1f175db002b06e3eac2765cfae1518)) by @cgoinglove
* enhance event handling for keyboard shortcuts in chat components ([95dad3b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/95dad3bd1dac4b6e56be2df35957a849617ba056)) by @cgoinglove
* enhance mobile UI experience with responsive design adjustments ([2eee8ba](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2eee8bab078207841f4d30ce7708885c7268302e)) by @cgoinglove
* enhance ToolModeDropdown with tooltip updates and debounce functionality ([d06db0b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d06db0b3e1db34dc4785eb31ebd888d7c2ae0d64)) by @cgoinglove
* ensure PKCE works for MCP Server auth ([#256](https://github.com/Osama-Qonaibe/hebronai-v2/issues/256)) ([09b938f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/09b938f17ca78993a1c7b84c5a702b95159542b2)) by @jvg123
* ensure thread date fallback to current date in AppSidebarThreads component ([800b504](https://github.com/Osama-Qonaibe/hebronai-v2/commit/800b50498576cfe1717da4385e2a496ac33ea0ad)) by @cgoinglove
* enter ([78573e4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/78573e4de8d509cf717123235e55e6d801eeb581)) by @cgoinglove
* generate title by user message ([9ee4be6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9ee4be69c6b90f44134d110e90f9c3da5219c79f)) by @cgoinglove
* generate title sync ([5f3afdc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5f3afdc4cb7304460606b3480f54f513ef24940c)) by @cgoinglove
* hide MCP server credentials from non-owners ([#317](https://github.com/Osama-Qonaibe/hebronai-v2/issues/317)) ([#319](https://github.com/Osama-Qonaibe/hebronai-v2/issues/319)) ([6e32417](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6e32417535c27f1215f96d68b7302dba4a1b904d)) by @jezweb
* husky ([3dcde85](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3dcde858a365ee57fb67c518e61855485c34c6e3)) by @brrock
* **i18n:** update agent description fields in English, Spanish, and French JSON files to improve clarity and consistency ([f07d1c4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f07d1c4dc64b96584faa7e558f981199834a5370)) by @cgoinglove
* ignore tool binding on unsupported models (server-side) ([#160](https://github.com/Osama-Qonaibe/hebronai-v2/issues/160)) ([277b4fe](https://github.com/Osama-Qonaibe/hebronai-v2/commit/277b4fe986d5b6d9780d9ade83f294d8f34806f6)) by @cgoinglove
* implement responsive horizontal layout for chat mention input with improved UX And generate Agent Prompt ([43ec980](https://github.com/Osama-Qonaibe/hebronai-v2/commit/43ec98059e0d27ab819491518263df55fb1c9ad3)) by @cgoinglove
* improve error display with better UX and animation handling ([#227](https://github.com/Osama-Qonaibe/hebronai-v2/issues/227)) ([35d62e0](https://github.com/Osama-Qonaibe/hebronai-v2/commit/35d62e05bb21760086c184511d8062444619696c)) by @cgoinglove
* improve session error handling in authentication ([eb15b55](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eb15b550facf5368f990d58b4b521bf15aecbf72)) by @cgoinglove
* increase maxTokens for title generation in chat actions issue  [#102](https://github.com/Osama-Qonaibe/hebronai-v2/issues/102) ([bea2588](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bea2588e24cf649133e8ce5f3b6391265b604f06)) by @cgoinglove
* Invalid 'tools': array too long. Expected an array with maximum length 128, but got an array with length 217 instead. [#197](https://github.com/Osama-Qonaibe/hebronai-v2/issues/197) ([b967e3a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b967e3a30be3a8a48f3801b916e26ac4d7dd50f4)) by @cgoinglove
* js executor tool and gemini model version ([#169](https://github.com/Osama-Qonaibe/hebronai-v2/issues/169)) ([e25e10a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e25e10ab9fac4247774b0dee7e01d5f6a4b16191)) by @cgoinglove
* link to the config generator correctly ([#184](https://github.com/Osama-Qonaibe/hebronai-v2/issues/184)) ([1865ecc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1865ecc269e567838bc391a3236fcce82c213fc0)) by @brrock
* **mcp:** ensure database and memory manager sync across server instances ([#229](https://github.com/Osama-Qonaibe/hebronai-v2/issues/229)) ([c4b8ebe](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c4b8ebe9566530986951671e36111a2e529bf592)) by @cgoinglove
* **mcp:** fix MCP infinite loading issue ([#220](https://github.com/Osama-Qonaibe/hebronai-v2/issues/220)) ([c25e351](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c25e3515867c76cc5494a67e79711e9343196078)) by @cgoing-bot
* **mcp:** improve 401 detection for OAuth flow trigger ([#362](https://github.com/Osama-Qonaibe/hebronai-v2/issues/362)) ([a99dca9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a99dca9a26117dec41611a1f40038b80026a675b)) by @hakonharnes
* **mcp:** Safe MCP manager init logic for the Vercel environment ([#202](https://github.com/Osama-Qonaibe/hebronai-v2/issues/202)) ([708fdfc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/708fdfcfed70299044a90773d3c9a76c9a139f2f)) by @cgoing-bot
* model name for gpt-4.1-mini in staticModels ([#299](https://github.com/Osama-Qonaibe/hebronai-v2/issues/299)) ([4513ac0](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4513ac0e842f588a24d7075af8700e3cc7a3eb39)) by @mayur9210
* ollama disable issue ([#283](https://github.com/Osama-Qonaibe/hebronai-v2/issues/283)) ([5e0a690](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5e0a690bb6c3f074680d13e09165ca9fff139f93)) by @cgoinglove
* preserve whitespace in chat input during editing ([#361](https://github.com/Osama-Qonaibe/hebronai-v2/issues/361)) ([e914a30](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e914a30f66113c49b60ff3695b52db3d8d7e3a8f)) by @hakonharnes
* python executor ([ea58742](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ea58742cccd5490844b3139a37171b1b68046f85)) by @cgoinglove
* refine thinking prompt condition in chat API ([0192151](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0192151fec1e33f3b7bc1f08b0a9582d66650ef0)) by @cgoinglove
* remove file to get file types for lint-staged ([0c1e7eb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0c1e7eb0ba74c8b9222f4981b7d38bae41df1a17)) by @brrock
* restore src/lib/const.ts (pre-Arabic state) ([3724d21](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3724d21f0df0a2b650438b4309c8759922b46aba)) by @Osama-Qonaibe
* **scripts:** parse openai compatible on windows ([#164](https://github.com/Osama-Qonaibe/hebronai-v2/issues/164)) ([41f5ff5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/41f5ff55b8d17c76a23a2abf4a6e4cb0c4d95dc5)) by @axel7083
* simplify release workflow and add timeout protection ([a8f8dae](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a8f8daef9d358ecb34fb1dfb352df4f4403c37b8)) by @Osama-Qonaibe
* simplify release-please config to resolve workflow timeout ([bf21ddd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bf21ddd3a08e8d7627426ea922a25045f6416ec8)) by @Osama-Qonaibe
* skip signup method selection when only email is enabled ([#338](https://github.com/Osama-Qonaibe/hebronai-v2/issues/338)) ([7538bc8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7538bc8babb0943f2857a9a9139bff79e2c5e486)) by @hakonharnes
* speech ux ([baa849f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/baa849ff2b6b147ec685c6847834385652fc3191)) by @cgoinglove
* split theme system into base themes and style variants ([61ebd07](https://github.com/Osama-Qonaibe/hebronai-v2/commit/61ebd0745bcfd7a84ba3ad65c3f52b7050b5131a)) by @cgoinglove
* support OpenAI real-time chat project instructions ([2ebbb5e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2ebbb5e68105ef6706340a6cfbcf10b4d481274a)) by @cgoinglove
* temporary chat initial model ([0393f7a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0393f7a190463faf58cbfbca1c21d349a9ff05dc)) by @cgoinglove
* text message part inline buttons is not visible on mobile ([#334](https://github.com/Osama-Qonaibe/hebronai-v2/issues/334)) ([666c395](https://github.com/Osama-Qonaibe/hebronai-v2/commit/666c395865d03dd33884f9f17933b1a3659d44eb)), closes [#333](https://github.com/Osama-Qonaibe/hebronai-v2/issues/333) by @theuargb
* tool select ui ([#141](https://github.com/Osama-Qonaibe/hebronai-v2/issues/141)) ([0795524](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0795524991a7aa3e17990777ca75381e32eaa547)) by @cgoinglove
* UI improvements for mobile experience ([#66](https://github.com/Osama-Qonaibe/hebronai-v2/issues/66)) ([b4349ab](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b4349abf75de69f65a44735de2e0988c6d9d42d8)) by @cgoinglove
* unify SSE and streamable config as RemoteConfig ([#85](https://github.com/Osama-Qonaibe/hebronai-v2/issues/85)) ([66524a0](https://github.com/Osama-Qonaibe/hebronai-v2/commit/66524a0398bd49230fcdec73130f1eb574e97477)) by @cgoing-bot
* update adding-openAI-like-providers.md ([#101](https://github.com/Osama-Qonaibe/hebronai-v2/issues/101)) ([2bb94e7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2bb94e7df63a105e33c1d51271751c7b89fead23)) by @brrock
* update config file path in release workflow ([7209cbe](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7209cbeb89bd65b14aee66a40ed1abb5c5f2e018)) by @cgoinglove
* update lastThreadAt calculation in chat repository to handle null values by using COALESCE for better data integrity ([4a5489c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4a5489c8cfacc3d84fb439725e0b3cd5f21469ac)) by @cgoinglove
* update release workflow to use PAT for permissions ([1b614eb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1b614ebd2d88024de1d802dd98770517d9ccfac5)) by @Osama-Qonaibe
* update release-please config with required settings ([776cc46](https://github.com/Osama-Qonaibe/hebronai-v2/commit/776cc46f7ce6c6553f5976ac50129800b3c76a7f)) by @Osama-Qonaibe
* update sign-out behavior to redirect to sign-in page instead of … ([#61](https://github.com/Osama-Qonaibe/hebronai-v2/issues/61)) ([04f771a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/04f771aa0ee1c170438ba8c78dd377fb65cea05e)) by @cgoing-bot
* update sign-out behavior to redirect to sign-in page instead of reloading the window for improved user experience ([3001591](https://github.com/Osama-Qonaibe/hebronai-v2/commit/30015915e9c53a047451bc1501148918f0a941b7)) by @cgoinglove
* update tool selection logic in McpServerSelector to maintain current selections ([4103c1b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4103c1b828c3e5b513679a3fb9d72bd37301f99d)) by @cgoinglove
* update ToolMessagePart to use isExecuting state instead of isExpanded ([752f8f0](https://github.com/Osama-Qonaibe/hebronai-v2/commit/752f8f06e319119569e9ee7c04d621ab1c43ca54)) by @cgoinglove
* update translation key in ErrorMessage component for improved lo… ([#60](https://github.com/Osama-Qonaibe/hebronai-v2/issues/60)) ([463ea4b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/463ea4b1c129f6554737495dd17401f01f1aad0d)) by @cgoing-bot
* update translation key in ErrorMessage component for improved localization consistency ([789172b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/789172b341c5c0d3a68781f6ca89468ecba5742c)) by @cgoinglove
* use translation for user settings menu item ([#339](https://github.com/Osama-Qonaibe/hebronai-v2/issues/339)) ([eadc71a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eadc71ae6d62ae297aeff44979591bd03a86b19d)) by @hakonharnes
* workflow condition node issue ([78b7add](https://github.com/Osama-Qonaibe/hebronai-v2/commit/78b7addbba51b4553ec5d0ce8961bf90be5d649c)) by @cgoinglove
* **workflow-panel:** fix save button width ([#168](https://github.com/Osama-Qonaibe/hebronai-v2/issues/168)) ([3e66226](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3e6622630c9cc40ff3d4357e051c45f8c860fc10)) by @axel7083
* **workflow:** enhance structured output handling and improve user notifications ([dd43de9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/dd43de99881d64ca0c557e29033e953bcd4adc0e)) by @cgoinglove
* **workflow:** improve mention handling by ensuring empty values are represented correctly ([92ff9c3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/92ff9c3e14b97d9f58a22f9df2559e479f14537c)) by @cgoinglove
* **workflow:** llm structure Output ([c529292](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c529292ddc1a4b836a5921e25103598afd7e3ab7)) by @cgoinglove
* **workflow:** MCP tool response structure and workflow ([#113](https://github.com/Osama-Qonaibe/hebronai-v2/issues/113)) ([836ffd7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/836ffd7ef5858210bdce44d18ca82a1c8f0fc87f)) by @cgoing-bot
* **workflow:** simplify mention formatting by removing bold styling for non-empty values ([ef65fd7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ef65fd713ab59c7d8464cae480df7626daeff5cd)) by @cgoinglove


### Reverts

* **i18n:** remove Arabic as default locale ([d742427](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d742427ebebf24301987c821eeb97dab8538798e)) by @Osama-Qonaibe


### Miscellaneous Chores

* release 1.5.2 ([d185514](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d1855148cfa53ea99c9639f8856d0e7c58eca020)) by @cgoinglove

## [1.26.0](https://github.com/cgoinglove/better-chatbot/compare/v1.25.0...v1.26.0) (2025-11-07)


### Features

* add LaTeX/TeX math equation rendering support ([#318](https://github.com/cgoinglove/better-chatbot/issues/318)) ([c0a8b5b](https://github.com/cgoinglove/better-chatbot/commit/c0a8b5b9b28599716013c83cac03fa5745ffd403)) by @jezweb


### Bug Fixes

* hide MCP server credentials from non-owners ([#317](https://github.com/cgoinglove/better-chatbot/issues/317)) ([#319](https://github.com/cgoinglove/better-chatbot/issues/319)) ([6e32417](https://github.com/cgoinglove/better-chatbot/commit/6e32417535c27f1215f96d68b7302dba4a1b904d)) by @jezweb

## [1.25.0](https://github.com/cgoinglove/better-chatbot/compare/v1.24.0...v1.25.0) (2025-10-30)


### Features

* s3 storage and richer file support ([#301](https://github.com/cgoinglove/better-chatbot/issues/301)) ([051a974](https://github.com/cgoinglove/better-chatbot/commit/051a9740a6ecf774bfead9ce327c376ea5b279a5)) by @mrjasonroy


### Bug Fixes

* model name for gpt-4.1-mini in staticModels ([#299](https://github.com/cgoinglove/better-chatbot/issues/299)) ([4513ac0](https://github.com/cgoinglove/better-chatbot/commit/4513ac0e842f588a24d7075af8700e3cc7a3eb39)) by @mayur9210

## [1.24.0](https://github.com/cgoinglove/better-chatbot/compare/v1.23.0...v1.24.0) (2025-10-06)


### Features

* generate image Tool (Nano Banana) ([#284](https://github.com/cgoinglove/better-chatbot/issues/284)) ([984ce66](https://github.com/cgoinglove/better-chatbot/commit/984ce665ceef7225870f4eb751afaf65bf8a2dd4)) by @cgoinglove
* openai image generate ([#287](https://github.com/cgoinglove/better-chatbot/issues/287)) ([0deef6e](https://github.com/cgoinglove/better-chatbot/commit/0deef6e8a83196afb1f44444ab2f13415de20e73)) by @cgoinglove

## [1.23.0](https://github.com/cgoinglove/better-chatbot/compare/v1.22.0...v1.23.0) (2025-10-04)


### Features

* export chat thread ([#278](https://github.com/cgoinglove/better-chatbot/issues/278)) ([23e79cd](https://github.com/cgoinglove/better-chatbot/commit/23e79cd570c24bab0abc496eca639bfffcb6060b)) by @cgoinglove
* **file-storage:** image uploads, generate profile with ai ([#257](https://github.com/cgoinglove/better-chatbot/issues/257)) ([46eb43f](https://github.com/cgoinglove/better-chatbot/commit/46eb43f84792d48c450f3853b48b24419f67c7a1)) by @brrock


### Bug Fixes

* Apply DISABLE_SIGN_UP to OAuth providers ([#282](https://github.com/cgoinglove/better-chatbot/issues/282)) ([bcc0db8](https://github.com/cgoinglove/better-chatbot/commit/bcc0db8eb81997e54e8904e64fc76229fbfc1338)) by @cgoing-bot
* ollama disable issue ([#283](https://github.com/cgoinglove/better-chatbot/issues/283)) ([5e0a690](https://github.com/cgoinglove/better-chatbot/commit/5e0a690bb6c3f074680d13e09165ca9fff139f93)) by @cgoinglove

## [1.22.0](https://github.com/cgoinglove/better-chatbot/compare/v1.21.0...v1.22.0) (2025-09-25)

### Features

- admin and roles ([#270](https://github.com/cgoinglove/better-chatbot/issues/270)) ([63bddca](https://github.com/cgoinglove/better-chatbot/commit/63bddcaa4bc62bc85204a0982a06f2bed09fc5f5)) by @mrjasonroy
- groq provider ([#268](https://github.com/cgoinglove/better-chatbot/issues/268)) ([aef213d](https://github.com/cgoinglove/better-chatbot/commit/aef213d2f9dd0255996cc4184b03425db243cd7b)) by @cgoinglove
- hide LLM providers without API keys in model selection ([#269](https://github.com/cgoinglove/better-chatbot/issues/269)) ([63c15dd](https://github.com/cgoinglove/better-chatbot/commit/63c15dd386ea99b8fa56f7b6cb1e58e5779b525d)) by @cgoinglove
- **voice-chat:** binding agent tools ([#275](https://github.com/cgoinglove/better-chatbot/issues/275)) ([ed45e82](https://github.com/cgoinglove/better-chatbot/commit/ed45e822eb36447f2a02ef3aa69eeec88009e357)) by @cgoinglove

### Bug Fixes

- ensure PKCE works for MCP Server auth ([#256](https://github.com/cgoinglove/better-chatbot/issues/256)) ([09b938f](https://github.com/cgoinglove/better-chatbot/commit/09b938f17ca78993a1c7b84c5a702b95159542b2)) by @jvg123

## [1.21.0](https://github.com/cgoinglove/better-chatbot/compare/v1.20.2...v1.21.0) (2025-08-24)

### Features

- agent sharing ([#226](https://github.com/cgoinglove/better-chatbot/issues/226)) ([090dd8f](https://github.com/cgoinglove/better-chatbot/commit/090dd8f4bf4fb82beb2cd9bfa0b427425bbbf352)) by @mrjasonroy
- ai v5 ([#230](https://github.com/cgoinglove/better-chatbot/issues/230)) ([0461879](https://github.com/cgoinglove/better-chatbot/commit/0461879740860055a278c96656328367980fa533)) by @cgoinglove
- improve markdown table styling ([#244](https://github.com/cgoinglove/better-chatbot/issues/244)) ([7338e04](https://github.com/cgoinglove/better-chatbot/commit/7338e046196f72a7cc8ec7903593d94ecabcc05e)) by @hakonharnes

### Bug Fixes

- [#111](https://github.com/cgoinglove/better-chatbot/issues/111) prevent MCP server disconnection during long-running tool calls ([#238](https://github.com/cgoinglove/better-chatbot/issues/238)) ([b5bb3dc](https://github.com/cgoinglove/better-chatbot/commit/b5bb3dc40a025648ecd78f547e0e1a2edd8681ca)) by @cgoinglove

## [1.20.2](https://github.com/cgoinglove/better-chatbot/compare/v1.20.1...v1.20.2) (2025-08-09)

### Bug Fixes

- improve error display with better UX and animation handling ([#227](https://github.com/cgoinglove/better-chatbot/issues/227)) ([35d62e0](https://github.com/cgoinglove/better-chatbot/commit/35d62e05bb21760086c184511d8062444619696c)) by @cgoinglove
- **mcp:** ensure database and memory manager sync across server instances ([#229](https://github.com/cgoinglove/better-chatbot/issues/229)) ([c4b8ebe](https://github.com/cgoinglove/better-chatbot/commit/c4b8ebe9566530986951671e36111a2e529bf592)) by @cgoinglove

## [1.20.1](https://github.com/cgoinglove/better-chatbot/compare/v1.20.0...v1.20.1) (2025-08-06)

### Bug Fixes

- **mcp:** fix MCP infinite loading issue ([#220](https://github.com/cgoinglove/better-chatbot/issues/220)) ([c25e351](https://github.com/cgoinglove/better-chatbot/commit/c25e3515867c76cc5494a67e79711e9343196078)) by @cgoing-bot

## [1.20.0](https://github.com/cgoinglove/better-chatbot/compare/v1.19.1...v1.20.0) (2025-08-04)

### Features

- add qwen3 coder to models file for openrouter ([#206](https://github.com/cgoinglove/better-chatbot/issues/206)) ([3731d00](https://github.com/cgoinglove/better-chatbot/commit/3731d007100ac36a814704f8bde8398ce1378a4e)) by @brrock
- improve authentication configuration and social login handling ([#211](https://github.com/cgoinglove/better-chatbot/issues/211)) ([cd25937](https://github.com/cgoinglove/better-chatbot/commit/cd25937020710138ab82458e70ea7f6cabfd03ca)) by @mrjasonroy
- introduce interactive table creation and enhance visualization tools ([#205](https://github.com/cgoinglove/better-chatbot/issues/205)) ([623a736](https://github.com/cgoinglove/better-chatbot/commit/623a736f6895b8737acaa06811088be2dc1d0b3c)) by @cgoing-bot
- **mcp:** oauth ([#208](https://github.com/cgoinglove/better-chatbot/issues/208)) ([136aded](https://github.com/cgoinglove/better-chatbot/commit/136aded6de716367380ff64c2452d1b4afe4aa7f)) by @cgoinglove
- **web-search:** replace Tavily API with Exa AI integration ([#204](https://github.com/cgoinglove/better-chatbot/issues/204)) ([7140487](https://github.com/cgoinglove/better-chatbot/commit/7140487dcdadb6c5cb6af08f92b06d42411f7168)) by @cgoing-bot

### Bug Fixes

- implement responsive horizontal layout for chat mention input with improved UX And generate Agent Prompt ([43ec980](https://github.com/cgoinglove/better-chatbot/commit/43ec98059e0d27ab819491518263df55fb1c9ad3)) by @cgoinglove
- **mcp:** Safe MCP manager init logic for the Vercel environment ([#202](https://github.com/cgoinglove/better-chatbot/issues/202)) ([708fdfc](https://github.com/cgoinglove/better-chatbot/commit/708fdfcfed70299044a90773d3c9a76c9a139f2f)) by @cgoing-bot

## [1.19.1](https://github.com/cgoinglove/better-chatbot/compare/v1.19.0...v1.19.1) (2025-07-29)

### Bug Fixes

- **agent:** improve agent loading logic and validation handling in EditAgent component [#198](https://github.com/cgoinglove/better-chatbot/issues/198) ([ec034ab](https://github.com/cgoinglove/better-chatbot/commit/ec034ab51dfc656d7378eca1e2b4dc94fbb67863)) by @cgoinglove
- **agent:** update description field to allow nullish values in ChatMentionSchema ([3e4532d](https://github.com/cgoinglove/better-chatbot/commit/3e4532d4c7b561ad03836c743eefb7cd35fe9e74)) by @cgoinglove
- **i18n:** update agent description fields in English, Spanish, and French JSON files to improve clarity and consistency ([f07d1c4](https://github.com/cgoinglove/better-chatbot/commit/f07d1c4dc64b96584faa7e558f981199834a5370)) by @cgoinglove
- Invalid 'tools': array too long. Expected an array with maximum length 128, but got an array with length 217 instead. [#197](https://github.com/cgoinglove/better-chatbot/issues/197) ([b967e3a](https://github.com/cgoinglove/better-chatbot/commit/b967e3a30be3a8a48f3801b916e26ac4d7dd50f4)) by @cgoinglove

## [1.19.0](https://github.com/cgoinglove/better-chatbot/compare/v1.18.0...v1.19.0) (2025-07-28)

### Features

- Add Azure OpenAI provider support with comprehensive testing ([#189](https://github.com/cgoinglove/better-chatbot/issues/189)) ([edad917](https://github.com/cgoinglove/better-chatbot/commit/edad91707d49fcb5d3bd244a77fbaae86527742a)) by @shukyr
- add bot name preference to user settings ([f4aa588](https://github.com/cgoinglove/better-chatbot/commit/f4aa5885d0be06cc21149d09e604c781e551ec4a)) by @cgoinglove
- **agent:** agent and archive ([#192](https://github.com/cgoinglove/better-chatbot/issues/192)) ([c63ae17](https://github.com/cgoinglove/better-chatbot/commit/c63ae179363b66bfa4f4b5524bdf27b71166c299)) by @cgoinglove

### Bug Fixes

- enhance event handling for keyboard shortcuts in chat components ([95dad3b](https://github.com/cgoinglove/better-chatbot/commit/95dad3bd1dac4b6e56be2df35957a849617ba056)) by @cgoinglove
- refine thinking prompt condition in chat API ([0192151](https://github.com/cgoinglove/better-chatbot/commit/0192151fec1e33f3b7bc1f08b0a9582d66650ef0)) by @cgoinglove

## [1.18.0](https://github.com/cgoinglove/better-chatbot/compare/v1.17.1...v1.18.0) (2025-07-24)

### Features

- add sequential thinking tool and enhance UI components ([#183](https://github.com/cgoinglove/better-chatbot/issues/183)) ([5bcbde2](https://github.com/cgoinglove/better-chatbot/commit/5bcbde2de776b17c3cc1f47f4968b13e22fc65b2)) by @cgoinglove

## [1.17.1](https://github.com/cgoinglove/better-chatbot/compare/v1.17.0...v1.17.1) (2025-07-23)

### Bug Fixes

- ensure thread date fallback to current date in AppSidebarThreads component ([800b504](https://github.com/cgoinglove/better-chatbot/commit/800b50498576cfe1717da4385e2a496ac33ea0ad)) by @cgoinglove
- link to the config generator correctly ([#184](https://github.com/cgoinglove/better-chatbot/issues/184)) ([1865ecc](https://github.com/cgoinglove/better-chatbot/commit/1865ecc269e567838bc391a3236fcce82c213fc0)) by @brrock
- python executor ([ea58742](https://github.com/cgoinglove/better-chatbot/commit/ea58742cccd5490844b3139a37171b1b68046f85)) by @cgoinglove

## [1.17.0](https://github.com/cgoinglove/better-chatbot/compare/v1.16.0...v1.17.0) (2025-07-18)

### Features

- add Python execution tool and integrate Pyodide support ([#176](https://github.com/cgoinglove/better-chatbot/issues/176)) ([de2cf7b](https://github.com/cgoinglove/better-chatbot/commit/de2cf7b66444fe64791ed142216277a5f2cdc551)) by @cgoinglove

### Bug Fixes

- generate title by user message ([9ee4be6](https://github.com/cgoinglove/better-chatbot/commit/9ee4be69c6b90f44134d110e90f9c3da5219c79f)) by @cgoinglove
- generate title sync ([5f3afdc](https://github.com/cgoinglove/better-chatbot/commit/5f3afdc4cb7304460606b3480f54f513ef24940c)) by @cgoinglove

## [1.16.0](https://github.com/cgoinglove/better-chatbot/compare/v1.15.0...v1.16.0) (2025-07-15)

### Features

- Lazy Chat Title Generation: Save Empty Title First, Then Generate and Upsert in Parallel ([#162](https://github.com/cgoinglove/better-chatbot/issues/162)) ([31dfd78](https://github.com/cgoinglove/better-chatbot/commit/31dfd7802e33d8d4e91aae321c3d16a07fe42552)) by @cgoinglove
- publish container to GitHub registry ([#149](https://github.com/cgoinglove/better-chatbot/issues/149)) ([9f03cbc](https://github.com/cgoinglove/better-chatbot/commit/9f03cbc1d2890746f14919ebaad60f773b0a333d)) by @codingjoe
- update mention ux ([#161](https://github.com/cgoinglove/better-chatbot/issues/161)) ([7ceb9c6](https://github.com/cgoinglove/better-chatbot/commit/7ceb9c69c32de25d523a4d14623b25a34ffb3c9d)) by @cgoinglove

### Bug Fixes

- bug(LineChart): series are incorrectly represented [#165](https://github.com/cgoinglove/better-chatbot/issues/165) ([4e4905c](https://github.com/cgoinglove/better-chatbot/commit/4e4905c0f7f6a3eca73ea2ac06f718fa29b0f821)) by @cgoinglove
- ignore tool binding on unsupported models (server-side) ([#160](https://github.com/cgoinglove/better-chatbot/issues/160)) ([277b4fe](https://github.com/cgoinglove/better-chatbot/commit/277b4fe986d5b6d9780d9ade83f294d8f34806f6)) by @cgoinglove
- js executor tool and gemini model version ([#169](https://github.com/cgoinglove/better-chatbot/issues/169)) ([e25e10a](https://github.com/cgoinglove/better-chatbot/commit/e25e10ab9fac4247774b0dee7e01d5f6a4b16191)) by @cgoinglove
- **scripts:** parse openai compatible on windows ([#164](https://github.com/cgoinglove/better-chatbot/issues/164)) ([41f5ff5](https://github.com/cgoinglove/better-chatbot/commit/41f5ff55b8d17c76a23a2abf4a6e4cb0c4d95dc5)) by @axel7083
- **workflow-panel:** fix save button width ([#168](https://github.com/cgoinglove/better-chatbot/issues/168)) ([3e66226](https://github.com/cgoinglove/better-chatbot/commit/3e6622630c9cc40ff3d4357e051c45f8c860fc10)) by @axel7083

## [1.15.0](https://github.com/cgoinglove/better-chatbot/compare/v1.14.1...v1.15.0) (2025-07-11)

### Features

- Add js-execution tool and bug fixes(tool call) ([#148](https://github.com/cgoinglove/better-chatbot/issues/148)) ([12b18a1](https://github.com/cgoinglove/better-chatbot/commit/12b18a1cf31a17e565eddc05764b5bd2d0b0edee)) by @cgoinglove

### Bug Fixes

- enhance ToolModeDropdown with tooltip updates and debounce functionality ([d06db0b](https://github.com/cgoinglove/better-chatbot/commit/d06db0b3e1db34dc4785eb31ebd888d7c2ae0d64)) by @cgoinglove

## [1.14.1](https://github.com/cgoinglove/better-chatbot/compare/v1.14.0...v1.14.1) (2025-07-09)

### Bug Fixes

- tool select ui ([#141](https://github.com/cgoinglove/better-chatbot/issues/141)) ([0795524](https://github.com/cgoinglove/better-chatbot/commit/0795524991a7aa3e17990777ca75381e32eaa547)) by @cgoinglove

## [1.14.0](https://github.com/cgoinglove/better-chatbot/compare/v1.13.0...v1.14.0) (2025-07-07)

### Features

- web-search with images ([bea76b3](https://github.com/cgoinglove/better-chatbot/commit/bea76b3a544d4cf5584fa29e5c509b0aee1d4fee)) by @cgoinglove
- **workflow:** add auto layout feature for workflow nodes and update UI messages ([0cfbffd](https://github.com/cgoinglove/better-chatbot/commit/0cfbffd631c9ae5c6ed57d47ca5f34b9acbb257d)) by @cgoinglove
- **workflow:** stable workflow ( add example workflow : baby-research ) ([#137](https://github.com/cgoinglove/better-chatbot/issues/137)) ([c38a7ea](https://github.com/cgoinglove/better-chatbot/commit/c38a7ea748cdb117a4d0f4b886e3d8257a135956)) by @cgoinglove

### Bug Fixes

- **api:** handle error case in chat route by using orElse for unwrap ([25580a2](https://github.com/cgoinglove/better-chatbot/commit/25580a2a9f6c9fbc4abc29fee362dc4b4f27f9b4)) by @cgoinglove
- **workflow:** llm structure Output ([c529292](https://github.com/cgoinglove/better-chatbot/commit/c529292ddc1a4b836a5921e25103598afd7e3ab7)) by @cgoinglove

## [1.13.0](https://github.com/cgoinglove/better-chatbot/compare/v1.12.1...v1.13.0) (2025-07-04)

### Features

- Add web search and content extraction tools using Tavily API ([#126](https://github.com/cgoinglove/better-chatbot/issues/126)) ([f7b4ea5](https://github.com/cgoinglove/better-chatbot/commit/f7b4ea5828b33756a83dd881b9afa825796bf69f)) by @cgoing-bot

### Bug Fixes

- workflow condition node issue ([78b7add](https://github.com/cgoinglove/better-chatbot/commit/78b7addbba51b4553ec5d0ce8961bf90be5d649c)) by @cgoinglove
- **workflow:** improve mention handling by ensuring empty values are represented correctly ([92ff9c3](https://github.com/cgoinglove/better-chatbot/commit/92ff9c3e14b97d9f58a22f9df2559e479f14537c)) by @cgoinglove
- **workflow:** simplify mention formatting by removing bold styling for non-empty values ([ef65fd7](https://github.com/cgoinglove/better-chatbot/commit/ef65fd713ab59c7d8464cae480df7626daeff5cd)) by @cgoinglove

## [1.12.1](https://github.com/cgoinglove/better-chatbot/compare/v1.12.0...v1.12.1) (2025-07-02)

### Bug Fixes

- **workflow:** enhance structured output handling and improve user notifications ([dd43de9](https://github.com/cgoinglove/better-chatbot/commit/dd43de99881d64ca0c557e29033e953bcd4adc0e)) by @cgoinglove

## [1.12.0](https://github.com/cgoinglove/better-chatbot/compare/v1.11.0...v1.12.0) (2025-07-01)

### Features

- **chat:** enable [@mention](https://github.com/mention) and tool click to trigger workflow execution in chat ([#122](https://github.com/cgoinglove/better-chatbot/issues/122)) ([b4e7f02](https://github.com/cgoinglove/better-chatbot/commit/b4e7f022fa155ef70be2aee9228a4d1d2643bf10)) by @cgoing-bot

### Bug Fixes

- clean changlelog and stop duplicate attributions in the changelog file ([#119](https://github.com/cgoinglove/better-chatbot/issues/119)) ([aa970b6](https://github.com/cgoinglove/better-chatbot/commit/aa970b6a2d39ac1f0ca22db761dd452e3c7a5542)) by @brrock

## [1.11.0](https://github.com/cgoinglove/better-chatbot/compare/v1.10.0...v1.11.0) (2025-06-28)

### Features

- **workflow:** Add HTTP and Template nodes with LLM structured output supportWorkflow node ([#117](https://github.com/cgoinglove/better-chatbot/issues/117)) ([10ec438](https://github.com/cgoinglove/better-chatbot/commit/10ec438f13849f0745e7fab652cdd7cef8e97ab6)) by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown
- **workflow:** add HTTP node configuration and execution support ([7d2f65f](https://github.com/cgoinglove/better-chatbot/commit/7d2f65fe4f0fdaae58ca2a69abb04abee3111c60)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown

### Bug Fixes

- add POST endpoint for MCP client saving with session validation ([fa005aa](https://github.com/cgoinglove/better-chatbot/commit/fa005aaecbf1f8d9279f5b4ce5ba85343e18202b)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- split theme system into base themes and style variants ([61ebd07](https://github.com/cgoinglove/better-chatbot/commit/61ebd0745bcfd7a84ba3ad65c3f52b7050b5131a)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- update ToolMessagePart to use isExecuting state instead of isExpanded ([752f8f0](https://github.com/cgoinglove/better-chatbot/commit/752f8f06e319119569e9ee7c04d621ab1c43ca54)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove

## [1.10.0](https://github.com/cgoinglove/better-chatbot/compare/v1.9.0...v1.10.0) (2025-06-27)

### Features

- **releases:** add debug logging to the add authors and update release step ([#105](https://github.com/cgoinglove/better-chatbot/issues/105)) ([c855a6a](https://github.com/cgoinglove/better-chatbot/commit/c855a6a94c49dfd93c9a8d1d0932aeda36bd6c7e)) by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown
- workflow beta ([#100](https://github.com/cgoinglove/better-chatbot/issues/100)) ([2f5ada2](https://github.com/cgoinglove/better-chatbot/commit/2f5ada2a66e8e3cd249094be9d28983e4331d3a1)) by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot

### Bug Fixes

- update tool selection logic in McpServerSelector to maintain current selections ([4103c1b](https://github.com/cgoinglove/better-chatbot/commit/4103c1b828c3e5b513679a3fb9d72bd37301f99d)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- **workflow:** MPC Tool Response Structure And Workflow ([#113](https://github.com/cgoinglove/better-chatbot/issues/113)) ([836ffd7](https://github.com/cgoinglove/better-chatbot/commit/836ffd7ef5858210bdce44d18ca82a1c8f0fc87f)) by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown by @unknown

## [1.9.0](https://github.com/cgoinglove/better-chatbot/compare/v1.8.0...v1.9.0) (2025-06-16)

### Features

- credit contributors in releases and changlogs ([#104](https://github.com/cgoinglove/better-chatbot/issues/104)) ([e0e4443](https://github.com/cgoinglove/better-chatbot/commit/e0e444382209a36f03b6e898f26ebd805032c306)) by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock

### Bug Fixes

- increase maxTokens for title generation in chat actions issue [#102](https://github.com/cgoinglove/better-chatbot/issues/102) ([bea2588](https://github.com/cgoinglove/better-chatbot/commit/bea2588e24cf649133e8ce5f3b6391265b604f06)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- temporary chat initial model ([0393f7a](https://github.com/cgoinglove/better-chatbot/commit/0393f7a190463faf58cbfbca1c21d349a9ff05dc)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- update adding-openAI-like-providers.md ([#101](https://github.com/cgoinglove/better-chatbot/issues/101)) ([2bb94e7](https://github.com/cgoinglove/better-chatbot/commit/2bb94e7df63a105e33c1d51271751c7b89fead23)) by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock
- update config file path in release workflow ([7209cbe](https://github.com/cgoinglove/better-chatbot/commit/7209cbeb89bd65b14aee66a40ed1abb5c5f2e018)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove

## [1.8.0](https://github.com/cgoinglove/better-chatbot/compare/v1.7.0...v1.8.0) (2025-06-11)

### Features

- add openAI compatible provider support ([#92](https://github.com/cgoinglove/better-chatbot/issues/92)) ([6682c9a](https://github.com/cgoinglove/better-chatbot/commit/6682c9a320aff9d91912489661d27ae9bb0f4440)) by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock by @brrock

### Bug Fixes

- Enhance component styles and configurations ([a7284f1](https://github.com/cgoinglove/better-chatbot/commit/a7284f12ca02ee29f7da4d57e4fe6e8c6ecb2dfc)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove

## [1.7.0](https://github.com/cgoinglove/better-chatbot/compare/v1.6.2...v1.7.0) (2025-06-06)

### Features

- Per User Custom instructions ([#86](https://github.com/cgoinglove/better-chatbot/issues/86)) ([d45c968](https://github.com/cgoinglove/better-chatbot/commit/d45c9684adfb0d9b163c83f3bb63310eef572279)) by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu by @vineetu

## [1.6.2](https://github.com/cgoinglove/better-chatbot/compare/v1.6.1...v1.6.2) (2025-06-04)

### Bug Fixes

- enhance error handling in chat bot component ([1519799](https://github.com/cgoinglove/better-chatbot/commit/15197996ba1f175db002b06e3eac2765cfae1518)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- improve session error handling in authentication ([eb15b55](https://github.com/cgoinglove/better-chatbot/commit/eb15b550facf5368f990d58b4b521bf15aecbf72)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- support OpenAI real-time chat project instructions ([2ebbb5e](https://github.com/cgoinglove/better-chatbot/commit/2ebbb5e68105ef6706340a6cfbcf10b4d481274a)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- unify SSE and streamable config as RemoteConfig ([#85](https://github.com/cgoinglove/better-chatbot/issues/85)) ([66524a0](https://github.com/cgoinglove/better-chatbot/commit/66524a0398bd49230fcdec73130f1eb574e97477)) by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot

## [1.6.1](https://github.com/cgoinglove/better-chatbot/compare/v1.6.0...v1.6.1) (2025-06-02)

### Bug Fixes

- speech ux ([baa849f](https://github.com/cgoinglove/better-chatbot/commit/baa849ff2b6b147ec685c6847834385652fc3191)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove

## [1.6.0](https://github.com/cgoinglove/better-chatbot/compare/v1.5.2...v1.6.0) (2025-06-01)

### Features

- add husky for formatting and checking commits ([#71](https://github.com/cgoinglove/better-chatbot/issues/71)) ([a379cd3](https://github.com/cgoinglove/better-chatbot/commit/a379cd3e869b5caab5bcaf3b03f5607021f988ef)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- add Spanish, French, Japanese, and Chinese language support with UI improvements ([#74](https://github.com/cgoinglove/better-chatbot/issues/74)) ([e34d43d](https://github.com/cgoinglove/better-chatbot/commit/e34d43df78767518f0379a434f8ffb1808b17e17)) by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot
- implement cold start-like auto connection for MCP server and simplify status ([#73](https://github.com/cgoinglove/better-chatbot/issues/73)) ([987c442](https://github.com/cgoinglove/better-chatbot/commit/987c4425504d6772e0aefe08b4e1911e4cb285c1)) by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot by @cgoing-bot

## [1.5.2](https://github.com/cgoinglove/better-chatbot/compare/v1.5.1...v1.5.2) (2025-06-01)

### Features

- Add support for Streamable HTTP Transport [#56](https://github.com/cgoinglove/better-chatbot/issues/56) ([8783943](https://github.com/cgoinglove/better-chatbot/commit/878394337e3b490ec2d17bcc302f38c695108d73)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- implement speech system prompt and update voice chat options for enhanced user interaction ([5a33626](https://github.com/cgoinglove/better-chatbot/commit/5a336260899ab542407c3c26925a147c1a9bba11)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- update MCP server UI and translations for improved user experience ([1e2fd31](https://github.com/cgoinglove/better-chatbot/commit/1e2fd31f8804669fbcf55a4c54ccf0194a7e797c)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove

### Bug Fixes

- enhance mobile UI experience with responsive design adjustments ([2eee8ba](https://github.com/cgoinglove/better-chatbot/commit/2eee8bab078207841f4d30ce7708885c7268302e)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove
- UI improvements for mobile experience ([#66](https://github.com/cgoinglove/better-chatbot/issues/66)) ([b4349ab](https://github.com/cgoinglove/better-chatbot/commit/b4349abf75de69f65a44735de2e0988c6d9d42d8)) by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove by @cgoinglove

### Miscellaneous Chores

- release 1.5.2 ([d185514](https://github.com/cgoinglove/better-chatbot/commit/d1855148cfa53ea99c9639f8856d0e7c58eca020)) by @cgoinglove
