# Changelog

## [5.7.3](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.7.2...hebronai-v2-v5.7.3) (2026-03-05)


### Bug Fixes

* add count property to models type definition ([70dd544](https://github.com/Osama-Qonaibe/hebronai-v2/commit/70dd544923cb33dabdcb4615569ed7d22130305e)) by @Osama-Qonaibe
* read models count from database for subscription cards ([f1d7ffe](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f1d7ffeeb3cfdaa7efabf3715e0e0d7a53d68167)) by @Osama-Qonaibe

## [5.7.2](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.7.1...hebronai-v2-v5.7.2) (2026-03-05)


### Bug Fixes

* resolve duplicate subscription plan cards display ([9580bcf](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9580bcf5d0785f85d054b6d70928c3868647d303)) by @Osama-Qonaibe

## [5.7.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.7.0...hebronai-v2-v5.7.1) (2026-03-05)


### Bug Fixes

* Add only usage recording after image generation (limit check handled by Chat API) ([a35d80a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a35d80a5e8fa97de1bf6b73fe67f89ee4ebe6213)) by @Osama-Qonaibe

## [5.7.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.6.0...hebronai-v2-v5.7.0) (2026-03-04)


### Features

* add cache clearing cron job ([96ab620](https://github.com/Osama-Qonaibe/hebronai-v2/commit/96ab62041d8e412caf5cfbfcddeb5f1e459fc484)) by @Osama-Qonaibe
* add health check monitoring cron job ([592533f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/592533f2035a86679a78479d52d5b6c37adef004)) by @Osama-Qonaibe
* add performance monitoring cron job ([4bbe213](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4bbe2138a463f1ba8da509823a1615ccec7aa0e3)) by @Osama-Qonaibe
* add usage limits reset cron job ([ce2fdfc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ce2fdfcfef02a1fd4b9be43e34e75c2391c4d491)) by @Osama-Qonaibe


### Bug Fixes

* remove redis dependency from clear-cache ([e7c1935](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e7c1935317bf780e0d0ec93f67cbf6a908d49b56)) by @Osama-Qonaibe
* remove redis dependency from health-check ([460adfd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/460adfd50577aa8ab6d63556556da8df66e25764)) by @Osama-Qonaibe
* remove redis dependency from performance-monitor ([bbfcc1f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bbfcc1f78cd01ea5271ff9b50237f0fcc83b997b)) by @Osama-Qonaibe
* remove unused sql import ([8e2d268](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8e2d268f104de3373f8b41f4ce5367e370d6307f)) by @Osama-Qonaibe
* remove unused variable ([f74ebeb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f74ebeb22c8fb88d1634f835b13d5dc7621712c4)) by @Osama-Qonaibe

## [5.6.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.5.0...hebronai-v2-v5.6.0) (2026-03-04)


### Features

* add Arabic translations for usage card ([c54efc4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c54efc484416964905e283dbfa6f0440408f61d0)) by @Osama-Qonaibe


### Bug Fixes

* show upgrade button for all plans except enterprise ([6e60762](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6e60762047f101509a8b5032cc1e5b833bd2c5ae)) by @Osama-Qonaibe

## [5.5.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.4.0...hebronai-v2-v5.5.0) (2026-03-04)


### Features

* add comprehensive usage tracking tables ([51d6c50](https://github.com/Osama-Qonaibe/hebronai-v2/commit/51d6c50c97faedb06a5f28b90dd0a5a0bf69725f)) by @Osama-Qonaibe
* add images and models count to usage API ([ffdcbbf](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ffdcbbf745e868b693448325ac0861d98628b853)) by @Osama-Qonaibe
* add images and models counters to usage card ([8516ee7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8516ee78c44bd95b75585b304be54735e1019201)) by @Osama-Qonaibe
* enable images tracking after migration ([b5fca72](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b5fca72238d69b54d6d3dd3ae6a303bf87dedafb)) by @Osama-Qonaibe
* usage card as dialog instead of permanent sidebar space ([bf61403](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bf614030d417aec09e47e0aa43c52b7fc17e95d8)) by @Osama-Qonaibe


### Bug Fixes

* correct import path for getAvailableModels ([eadbab5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eadbab55badc500403e03cb1a24a5ebd7ccc1a85)) by @Osama-Qonaibe
* correct models count from subscription cards ([a50e14c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a50e14c849c525140a86637664424f76dc7a5500)) by @Osama-Qonaibe
* remove images tracking until table exists ([aa466c9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aa466c991b434325048a0f53ddc24701b3539546)) by @Osama-Qonaibe
* remove unused X import ([01f5013](https://github.com/Osama-Qonaibe/hebronai-v2/commit/01f50139a2293badc3fa46f46d7d67f852cab0b0)) by @Osama-Qonaibe
* set static models count per plan ([0d99625](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0d996253e3ccdf28d2ff76339bd51d66e0053a60)) by @Osama-Qonaibe
* use customModelProvider for models count ([f3d45ab](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f3d45abdc78fb2cebe70d4683a13123493bef950)) by @Osama-Qonaibe

## [5.4.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.3.0...hebronai-v2-v5.4.0) (2026-03-04)


### Features

* add tokens usage to card ([2c4f0f8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2c4f0f83cd9238b2a53f5fae847d9c385f5ffa0b)) by @Osama-Qonaibe
* add usage API endpoint ([7a72d25](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7a72d256857dc766c89b2389cb38a43dc072ce5e)) by @Osama-Qonaibe
* improve usage card with full details ([a98c678](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a98c678dd6994b9b632219dafe079a7f811f9db8)) by @Osama-Qonaibe
* make usage card responsive to sidebar state ([e52b050](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e52b050c59c78dee97192a115ff32c2f071f9c81)) by @Osama-Qonaibe
* read actual plan from user table ([9ec1a29](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9ec1a29ced3bd7e990dbdc0c6d6cd38f87ba0cc2)) by @Osama-Qonaibe


### Bug Fixes

* correct imports for usage API ([3691ddb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3691ddbc9e2ec013b4e287639cff8f8938f48f6c)) by @Osama-Qonaibe
* remove unsupported indicatorClassName prop ([71132e4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/71132e482ba5417b4323902e9535fa8c6033731a)) by @Osama-Qonaibe
* remove unused imports ([a568a31](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a568a318f2f1a5fc9838db4e37700862e94335a7)) by @Osama-Qonaibe
* remove unused TrendingUp import ([b1eeb06](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b1eeb0663db0d066a2b7a846a3c957879e1efd20)) by @Osama-Qonaibe
* simplify usage API without relations ([2932558](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2932558348d8d421263ca6b71a117f563b0773a9)) by @Osama-Qonaibe
* use correct sidebar state property ([cd52d48](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cd52d487d1d807043ff9a6e058d4cc83263db38b)) by @Osama-Qonaibe

## [5.3.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.2.2...hebronai-v2-v5.3.0) (2026-03-04)


### Features

* add @radix-ui/react-progress dependency ([58f1b62](https://github.com/Osama-Qonaibe/hebronai-v2/commit/58f1b62bf6fd97505fae642178aa2489784d962e)) by @Osama-Qonaibe
* add Progress UI component ([1c8eaef](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1c8eaefcb154955a4ff31115afdda235ca62f7bd)) by @Osama-Qonaibe
* add usage limits API endpoint ([8603b72](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8603b729d6c4362537c213d2966c9eb2e7c81960)) by @Osama-Qonaibe
* add usage limits card component ([d5e8aac](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d5e8aacd65fd8797d06491f29b40d432816ae336)) by @Osama-Qonaibe
* add usage limits translations (EN/AR) ([a16791d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a16791d169e5494a80dfa31229d7e7103b8b5a1c)) by @Osama-Qonaibe
* add UsageLimitsCard to sidebar footer ([18564aa](https://github.com/Osama-Qonaibe/hebronai-v2/commit/18564aad1b2992a753bfdfe564be141605b69825)) by @Osama-Qonaibe


### Bug Fixes

* add Usage translations to complete en.json ([79ceb66](https://github.com/Osama-Qonaibe/hebronai-v2/commit/79ceb66580ca69dfc98de2d77416e79fa83c0442)) by @Osama-Qonaibe
* handle null daysLeft in TypeScript ([fa2bd37](https://github.com/Osama-Qonaibe/hebronai-v2/commit/fa2bd37a9c90ce42dfad7326436ffb64f5c5544c)) by @Osama-Qonaibe
* restore full en.json with Usage keys ([079c381](https://github.com/Osama-Qonaibe/hebronai-v2/commit/079c381e6cf121e13bb6e84a660cc67ecad66db5)) by @Osama-Qonaibe

## [5.2.2](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.2.1...hebronai-v2-v5.2.2) (2026-03-03)


### Bug Fixes

* Use built-in plans from plans.ts directly ([0e1b560](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0e1b5603de3e23f1ccd3eac6b82cecf8241f0edf)) by @Osama-Qonaibe

## [5.2.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.2.0...hebronai-v2-v5.2.1) (2026-03-03)


### Bug Fixes

* Add user subscription isActive to getUserPlan ([9f09106](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9f09106b525da9047650e28374ee7d7164c6a2b0)) by @Osama-Qonaibe

## [5.2.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.1.5...hebronai-v2-v5.2.0) (2026-03-03)


### Features

* Add migration for built-in subscription plans ([7d28e19](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7d28e198b0133d68bbd6c5033f42611d62f86ad8)) by @Osama-Qonaibe


### Bug Fixes

* Correct template string syntax in seed.ts ([42a8696](https://github.com/Osama-Qonaibe/hebronai-v2/commit/42a86961ab1b4c93997a2cebf45e1cb83089539d)) by @Osama-Qonaibe

## [5.1.5](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.1.4...hebronai-v2-v5.1.5) (2026-03-03)


### Bug Fixes

* Make seed script smart - update built-in plans instead of creating duplicates ([5de452b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5de452ba744073b8078e1ac91f9990dda286c499)) by @Osama-Qonaibe

## [5.1.4](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.1.3...hebronai-v2-v5.1.4) (2026-03-03)


### Bug Fixes

* Apply smart isActive check to protect limits while maintaining backward compatibility ([a382491](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a382491c21536b0a51958ccb85cbb2f3eabb04ff)) by @Osama-Qonaibe

## [5.1.3](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.1.2...hebronai-v2-v5.1.3) (2026-03-03)


### Bug Fixes

* enable agent creation for user role ([b7d3be7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b7d3be7dedd1617cd7536568c7e525e80d6f86c0)) by @Osama-Qonaibe

## [5.1.2](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.1.1...hebronai-v2-v5.1.2) (2026-03-03)


### Bug Fixes

* Correct OpenRouter model IDs to match API ([673bb6d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/673bb6d265491f756baf42a27a37029afddb8a55)) by @Osama-Qonaibe
* Replace DeepSeek with free version (correct API name) ([3275887](https://github.com/Osama-Qonaibe/hebronai-v2/commit/327588735f1bc295f8ca272cbd5957f53385b7ed)) by @Osama-Qonaibe

## [5.1.1](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.1.0...hebronai-v2-v5.1.1) (2026-03-03)


### Bug Fixes

* Remove unused imports from prompts.ts ([babac42](https://github.com/Osama-Qonaibe/hebronai-v2/commit/babac4259453a8fd0c6663db754b58ea828376ff)) by @Osama-Qonaibe

## [5.1.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v5.0.0...hebronai-v2-v5.1.0) (2026-03-03)


### Features

* add duration field to subscription_plan table ([e6d8144](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e6d8144324cf102d91ecff756ed423da0d4ffe23)) by @Osama-Qonaibe
* add duration fields to SubscriptionPlan type ([5ed57e6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5ed57e6465c6f472828cbd767afed59427a15297)) by @Osama-Qonaibe
* add duration fields to SubscriptionPlanTable schema ([a474694](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a47469434756317bd6e5a49ae50f5d843e3c356b)) by @Osama-Qonaibe
* add subscription_type to subscription_request table ([187a02b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/187a02b572c5f9c3d871f6070405610e00deec81)) by @Osama-Qonaibe
* add subscriptionType to SubscriptionRequestTable schema ([7d5cd1f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7d5cd1f31357d0f77b9df1ae5d965464487ef5fa)) by @Osama-Qonaibe
* use subscriptionType (monthly/yearly) for expiration calculation ([10c1a1e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/10c1a1e7816066ded29eef23f0d211e3a62c13f7)) by @Osama-Qonaibe


### Bug Fixes

* accept any plan slug for subscription requests ([43f2b20](https://github.com/Osama-Qonaibe/hebronai-v2/commit/43f2b209839625031c0d319f6e0d2d67e9db53e6)) by @Osama-Qonaibe
* Add modelsCount and featuredModels to plan conversion ([e98e21b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e98e21b87e1c229f3bff27757f00d76bf0974d82)) by @Osama-Qonaibe
* Better error handling for subscription approval ([f1da743](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f1da743be80c4561eb4607337a31966a5dc7bc5e)) by @Osama-Qonaibe
* Cast subscription.plan to SubscriptionPlan in chat route ([eb3c740](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eb3c740fa5f2b267cc5da66516f41e38829f23b3)) by @Osama-Qonaibe
* Cast subscription.plan to SubscriptionPlan type ([6d5f14c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6d5f14c8b30d0e19f9fcfd80dd78778a5162f86f)) by @Osama-Qonaibe
* change requestedPlan to text for admin plans support ([6e33c32](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6e33c324ea2be5fa9cc3094ef7a1834005eeee82)) by @Osama-Qonaibe
* change RequestedPlan type to string for admin plans ([5f204a2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5f204a20e3286111d76f2ce751f9e23ee2f36a74)) by @Osama-Qonaibe
* change requestedPlan type to string in admin types ([7f17f33](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7f17f3388a4bb8c0e005c3923d366642ec64048e)) by @Osama-Qonaibe
* Check planId before plan for custom subscriptions ([50c60e2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/50c60e2d534dc55a345907da7dfee9b478cdd44f)) by @Osama-Qonaibe
* Get plan slug from planId for custom plans ([aeb09be](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aeb09bef01806d887783578e147238ce696b3155)) by @Osama-Qonaibe
* handle admin plans without hardcoded payment gateways ([4ecba46](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4ecba464b9848606f80f35ddd4114dfddd7faf16)) by @Osama-Qonaibe
* handle custom plans expiration with default 1 month ([68ed197](https://github.com/Osama-Qonaibe/hebronai-v2/commit/68ed19719d7cb8e8fce58c65a5fe633f0fa8c80c)) by @Osama-Qonaibe
* handle legacy plans approval without SubscriptionPlanTable lookup ([5d4bd05](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5d4bd05b4d884df94cb316251e08d1a4c26687f7)) by @Osama-Qonaibe
* Handle null plan update for custom subscriptions ([7360493](https://github.com/Osama-Qonaibe/hebronai-v2/commit/736049322eb4ed81c7715ea427435e3d9b346c12)) by @Osama-Qonaibe
* make duration fields optional to prevent build errors ([cb1a3a9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cb1a3a9353516f4d558f93652b46b71533ce7bbc)) by @Osama-Qonaibe
* Set plan to free for custom plans instead of null ([ebb1a8c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ebb1a8c32f5119b50a4404116da977e4d3a38bec)) by @Osama-Qonaibe
* Set plan to null for custom plans during approval ([1efcb7a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1efcb7a8d5163a3bfa7a2131c31ab16567d1e471)) by @Osama-Qonaibe
* Simplify custom plan approval without SQL ([7fce8c3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7fce8c37c8cc3b9173b67bef3fa977f097e1f925)) by @Osama-Qonaibe
* use plan duration from database for custom plans ([aa29a66](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aa29a66b223d7acf9d28c15035025384417d0a96)) by @Osama-Qonaibe
* Use PLAN_LIMITS from plans.ts for image limits instead of UnifiedPlanLimits ([71dd973](https://github.com/Osama-Qonaibe/hebronai-v2/commit/71dd97305827c792dea84896fee4155969bcd673)) by @Osama-Qonaibe
* use planId system for subscription approval ([baf3f46](https://github.com/Osama-Qonaibe/hebronai-v2/commit/baf3f4691e40cc3d3615f7de234df2625ee7e5b4)) by @Osama-Qonaibe

## [5.0.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.2.0...hebronai-v2-v5.0.0) (2026-03-02)


### ⚠ BREAKING CHANGES

* Plan names updated from 'premium' to 'pro' and added 'enterprise' tier

### Features

* Add admin plans API routes ([d80bbb1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d80bbb19882e2b3f1558a55850b07e50e5bacf6c)) by @Osama-Qonaibe
* Add admin plans page ([21d57b5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/21d57b5e1a6b0215aae42c4568dae8067cb92e02)) by @Osama-Qonaibe
* Add AdminPlans translations to en.json ([20479ad](https://github.com/Osama-Qonaibe/hebronai-v2/commit/20479ad6493e1edfacb91632336bca51fe739757)) by @Osama-Qonaibe
* add API endpoint to fetch available AI models dynamically ([a156f81](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a156f814f67a09bae912711d8f6992b0a07aeaa4)) by @Osama-Qonaibe
* Add Arabic translations for subscription page ([96dc2db](https://github.com/Osama-Qonaibe/hebronai-v2/commit/96dc2db2187d952817ef63edfcbc78483b7221d3)) by @CJWTRUST
* add full Arabic language support with RTL ([e8ac5ba](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e8ac5bafb92316f9b385ce6120cd9b447fb00138)) by @Osama-Qonaibe
* Add Full Arabic Language Support with RTL ([01d69b4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/01d69b46b9074d34e1777495566ad39dfe6b4f99)) by @Osama-Qonaibe
* Add getActivePlans function to plan service ([5bb869f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5bb869f9f040520e6798cc297da27f0e3c53e36a)) by @Osama-Qonaibe
* add image generation limits controls to plan dialog ([b345f39](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b345f39d27f727039e8eda9b64f7303b93da6600)) by @Osama-Qonaibe
* add image generation limits to subscription plans ([75db951](https://github.com/Osama-Qonaibe/hebronai-v2/commit/75db9516106cd6caa5b8438473abe60934978620)) by @Osama-Qonaibe
* Add locale to UserPreferences type ([78e0f1d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/78e0f1dc524af5b6b8c7ec4bd9fb73a5114fe41f)) by @Osama-Qonaibe
* add manual payment option for direct admin approval ([028410e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/028410e52dfde7c51ad3eae5f527c56f18057fad)) by @Osama-Qonaibe
* add migration script for image limits ([a98250d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a98250db11f59ac16efc2cb7207eee0da792d2d8)) by @Osama-Qonaibe
* Add migration script to link users to subscription plans ([8809541](https://github.com/Osama-Qonaibe/hebronai-v2/commit/88095417ca1aa16b2f2901bc630b9e85e31aca69)) by @Osama-Qonaibe
* add model display names for compact UI ([39ef573](https://github.com/Osama-Qonaibe/hebronai-v2/commit/39ef573a74e952c60025488603595cba7c97bf12)) by @Osama-Qonaibe
* Add PlanDialog component for creating/editing plans ([a7f22c9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a7f22c9a6a66a976845e5e3373828da8c33cc3b3)) by @Osama-Qonaibe
* Add planId foreign key to UserTable and update SubscriptionRequestTable ([b2fcbc8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b2fcbc88a911bda454bdf187d484992292b9b735)) by @Osama-Qonaibe
* Add Plans management link to admin sidebar ([1718e1f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1718e1f23cdca4023452ec033fcc11c1cd6b9479)) by @Osama-Qonaibe
* Add PlansTable component for admin ([c63ddcc](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c63ddcc7cda96d2b24758360143bd80f73f831df)) by @Osama-Qonaibe
* Add professional RTL support with locale middleware ([52254f4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/52254f4e1c32e23f86f0c99d554ed0b317f816d7)) by @Osama-Qonaibe
* Add public plans API and types ([6c343d6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6c343d6e44efa984947499205f900a6e79883387)) by @Osama-Qonaibe
* add PWA install prompt component ([7dbd836](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7dbd836eb76aa8b7ffcc8c41f11aa0a06cbdcb62)) by @Osama-Qonaibe
* add PWA install prompt to layout ([239f36a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/239f36a48d90bcc369035daa3d86e7c7d2dd66ea)) by @Osama-Qonaibe
* Add PWA support with manifest and service worker ([f23e27c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f23e27ca2928fcf94a5704c26c5ffa081ed226a2)) by @CJWTRUST
* Add seed plans API endpoint ([2c04a4c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2c04a4ca74993fb4750fbbca002d91f0fd4ace62)) by @Osama-Qonaibe
* Add seed script for default subscription plans ([e75d9e7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e75d9e7a87335b7ce4798af0247bb5cbab65548d)) by @Osama-Qonaibe
* add slider UI component for plan limits ([b221876](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b2218768dfd54cb1bd0fdafd2ffa30fedca07936)) by @Osama-Qonaibe
* Add SQL migration for planId foreign keys ([6db16fd](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6db16fdd90705a5ce8e188522e32596db568182c)) by @Osama-Qonaibe
* Add subscription plans and payment gateways tables ([545c762](https://github.com/Osama-Qonaibe/hebronai-v2/commit/545c7628bad79c7a25f19aa79e4eeb20ba108885)) by @Osama-Qonaibe
* add subscription system migration ([975d13a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/975d13a18168f00e14cab0c0fd97ea9df66c4e0f)) by @Osama-Qonaibe
* Add usePlans hook to fetch plans from API ([31bf465](https://github.com/Osama-Qonaibe/hebronai-v2/commit/31bf465238925cf2281ff6d00ca296e20dd2ecc7)) by @Osama-Qonaibe
* Auto-detect user locale from Accept-Language header ([a580b5d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a580b5dc2fbd1cee120f91106bbec031452ece3a)) by @Osama-Qonaibe
* cleaner and shorter model display names ([b6f8af4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b6f8af4c2d786f5f179b95a60ec69fb41b7b443a)) by @Osama-Qonaibe
* Complete Arabic translation for subscription page ([8bf3ba6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8bf3ba6b414867dd9176eafd496826be0880ee9e)) by @CJWTRUST
* complete pricing, models, and features tabs with full functionality ([1ada41a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1ada41a71c62b827695ec40345ffa00cfd2c239e)) by @Osama-Qonaibe
* Create dynamic pricing page ([78fa017](https://github.com/Osama-Qonaibe/hebronai-v2/commit/78fa0176b2723873c7b1989e5a57ea24647c7c8f)) by @Osama-Qonaibe
* Create icons folder for PWA setup ([f0a0b7d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f0a0b7d7d072c057f9fa33001a1624736ccd7314)) by @CJWTRUST
* Create pricing card component with features list ([3a4720a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3a4720a56c8c15778a226fed47fbdd9c71a5c94b)) by @Osama-Qonaibe
* Create pricing toggle component (Monthly/Yearly) ([1182f53](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1182f5331e0655c57549a4c4619e6589af4f48d1)) by @Osama-Qonaibe
* **db:** add hybrid subscription system fields ([8db9ed8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8db9ed87d852ca22510d27ef7d8aba7cf2befc9e)) by @Osama-Qonaibe
* Hybrid Subscription System + Dynamic Pricing Page ([447483c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/447483c2d60bd3ba1e344e154c058b4ea6de2a6f)) by @Osama-Qonaibe
* implement comprehensive subscription system with model access control and usage limits ([d6c1025](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d6c10259e83f12d468d4868137df1896d7a618d3)) by @CJWTRUST
* integrate enhanced plan dialog ([ce2f708](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ce2f7086e204e5321487b50e08154d196218a285)) by @Osama-Qonaibe
* load AI models dynamically from API with provider grouping ([22e240b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/22e240b473050ca14a0c919c1a1ae7791e2934e4)) by @Osama-Qonaibe
* merge static plans with admin-created plans ([72434a8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/72434a8e85894576a404c16c8600535998cfb321)) by @Osama-Qonaibe
* phase 1 - enhanced plan dialog with full admin controls ([5c83cf6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5c83cf646789d9d035afb540293f63d1bfe912a3)) by @Osama-Qonaibe
* prevent duplicate subscription requests and disable upgrade buttons ([be5728f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/be5728fdbb5fe56d4575f246aed72789fe1c4e40)) by @CJWTRUST
* **seed:** mark built-in plans and update existing plans ([f71dd73](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f71dd73252e8236b1ba418af978f558765be16a0)) by @Osama-Qonaibe
* **subscription:** create unified plan service for hybrid system ([9776a8b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9776a8bdf465353ba6dc9bd1d9c50a4242f85a55)) by @Osama-Qonaibe
* Update SubscriptionCard to use dynamic plans from API ([e765423](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e765423474fa7876f2b8e7246b9f0adb883fd813)) by @Osama-Qonaibe
* use short display names in model selector ([a26aad2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a26aad2fe276d6899bbecb109b84d1b432a35eed)) by @Osama-Qonaibe
* use short display names in plan models selector ([319e4c2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/319e4c2f0487c160fb2574739c9c0c9018f166ea)) by @Osama-Qonaibe
* إضافة ترجمات AdminPlans و Subscriptions للعربية ([834d5e4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/834d5e46fed6a547aa3ebf72e6e04d83f565e24e)) by @Osama-Qonaibe


### Bug Fixes

* add all required fields for SubscriptionPlan type ([95411d4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/95411d48bd873b1f4d70ec0b9bdc8790c35f681f)) by @Osama-Qonaibe
* add array validation for providers in useMemo to prevent crash ([eaf91f6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eaf91f62ccd696797b9893c8a5712bc77e008c3b)) by @CJWTRUST
* add array validation for providers.map in select-model ([9b5acd6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9b5acd681e6c744b1f22d348827ac268c2f595f1)) by @CJWTRUST
* add Cairo font for proper Arabic text rendering ([526f4be](https://github.com/Osama-Qonaibe/hebronai-v2/commit/526f4bee670aa738d1da14b0bfa23461c1e32fc4)) by @Osama-Qonaibe
* Add English translations for Subscription page ([55390a5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/55390a5d57920d03e7e3b7bbbd8ad40efe268f85)) by @CJWTRUST
* Add explicit type annotation for plan insert destructuring ([7e9b2ee](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7e9b2ee0666807fbaae3558bac15bb506dabfa78)) by @Osama-Qonaibe
* Add explicit type assertion for getUserById return ([6312867](https://github.com/Osama-Qonaibe/hebronai-v2/commit/63128679e8c9fe1989b73fca29356ef5493c9d6f)) by @Osama-Qonaibe
* Add explicit type for results array in seed-plans ([453dc7e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/453dc7eb19f0af42d901434ecd101ab999d41264)) by @Osama-Qonaibe
* Add forgot-password and reset-password to public routes ([568f373](https://github.com/Osama-Qonaibe/hebronai-v2/commit/568f3733ae9a6a90484a3874445c7896049f761c)) by @Osama-Qonaibe
* Add full URL and improve error handling for reset ([d0c75a4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d0c75a4800c0dedf28f605d73f66ac37a0da2e4b)) by @Osama-Qonaibe
* Add full URL for redirectTo and improve error handling ([8b01378](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8b01378b1846be45b9e4cba6725f13999d89deb7)) by @Osama-Qonaibe
* add missing Admin.Subscriptions.description translation ([2088df8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2088df86d2b5ec9d07547dad89d2f1a8d85e3bfc)) by @Osama-Qonaibe
* add missing AdminPlans translation keys (basic, pricing, settings, etc) ([fc981de](https://github.com/Osama-Qonaibe/hebronai-v2/commit/fc981de784240cc7554f5875e8ee1313d0305e9a)) by @Osama-Qonaibe
* add missing Arabic translations for Admin.Subscriptions and pending request messages ([17b20b1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/17b20b1ee8f149b97c30b23a6f0c458a130bf413)) by @CJWTRUST
* add null checks for PLANS to prevent TypeError crash ([bf34bac](https://github.com/Osama-Qonaibe/hebronai-v2/commit/bf34bac35a2d8dfc365326e2dcada394493fbc4e)) by @CJWTRUST
* Add proper type for currentPlan ([e031944](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e0319440d8dc1dad48a7182c4c4367814e921a92)) by @Osama-Qonaibe
* add RTL support for SidebarMenuButton icon alignment ([006b7f3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/006b7f37f9d65f46e23d2e7b2ab75b192bfc9c93)) by @Osama-Qonaibe
* add RTL support to Palette icon in theme button ([ec6a6be](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec6a6be3a0d231057bdec13022cf2c37b9f3f2cb)) by @Osama-Qonaibe
* Add schema to pgDb configuration ([67db96c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/67db96ca6feeecb7f5ab84866a254e3898f1e693)) by @Osama-Qonaibe
* add spacing between text and arrow in theme button ([cf36f3c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cf36f3c71ac79df53167dd9c7954645e39368542)) by @Osama-Qonaibe
* agents button RTL alignment - match other buttons padding ([38b9bd4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/38b9bd47b3da14c4eda8c63b34be3fe94dd98639)) by @Osama-Qonaibe
* archive button icon alignment ([5e107e5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5e107e5e628dc73beeacb61b5b7587b0c8264909)) by @Osama-Qonaibe
* archive button RTL alignment - match workflow button padding ([f9c902b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f9c902b2ab543024852429d77a64d12dd2961980)) by @Osama-Qonaibe
* Auto-detect RTL and position sidebar on right side ([2c4b5da](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2c4b5da72627023be5fdb6ff059e9cdc505ad10a)) by @Osama-Qonaibe
* change app name from 'Chat Bot' to 'HebronAI' ([474162d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/474162dc7ea5dfc4f321f17161102664e035d279)) by @Osama-Qonaibe
* Change default user role from editor to user ([2f47f8d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2f47f8d07b53bc9f8256ec341900336f2cf36994)) by @Osama-Qonaibe
* complete ar.json file - add missing closing braces and Chat section ([8e5015f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8e5015f6a113dd2f1be920499eeb63637198e0fd)) by @Osama-Qonaibe
* Complete RTL overhaul - clean CSS, fix FlipWords, restore button functionality ([a11fd24](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a11fd24d9e71ba9f1b4238f55784f2c631c52227)) by @Osama-Qonaibe
* complete RTL support for all UI elements ([9a30391](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9a30391c7a453243739e94fd8b43caa332c8726d)) by @Osama-Qonaibe
* complete RTL support for theme button icons ([ef4df55](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ef4df55cf3a60788a671cf65bd1c1de8234720c0)) by @Osama-Qonaibe
* comprehensive providers validation - prevent all array crashes ([864f393](https://github.com/Osama-Qonaibe/hebronai-v2/commit/864f393be283f45f746e036110aef0e0957d2fa4)) by @CJWTRUST
* Correct db import paths in all API routes ([745503d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/745503d5107a9f25e8070d450f2b7fb1ea7d4a1f)) by @Osama-Qonaibe
* correct discount type structure ([49c4bf2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/49c4bf207cce3598a0395234b1ab2649db1e875e)) by @Osama-Qonaibe
* Correct import paths in plan-service ([648623c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/648623c05e31976ba2185bcf7ce4ebfa13a248e3)) by @Osama-Qonaibe
* correct RTL alignment - keep icons on right without reversing order ([1dafecb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1dafecb690fc7b281dd45826970e75136ac2b3ec)) by @Osama-Qonaibe
* correct RTL selectors for dropdown menu ([5e6a286](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5e6a2863646b52540091f9f3a01eb2d070671b6c)) by @Osama-Qonaibe
* correct translation namespace for admin plans ([a12e512](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a12e5124e9e0b027f31b85695377a583d84c4a58)) by @Osama-Qonaibe
* critical subscription workflow fixes ([ec318ca](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec318caa147eb3537d88ac7c5ef0346fbfec614e)) by @CJWTRUST
* display plan names in current locale ([c6d6f30](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c6d6f30fdbb21aff822607178c12f830db93c6bd)) by @Osama-Qonaibe
* enable forgot password link for all users including first user ([dae6689](https://github.com/Osama-Qonaibe/hebronai-v2/commit/dae66890774a2db6d310ba0ee517fbe28fa2a076)) by @Osama-Qonaibe
* Enhance RTL Support for Arabic Interface ([dd0070d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/dd0070dfcd86d4e58c3d213fa8ec8275bfcc97b7)) by @Osama-Qonaibe
* enhance RTL support for sidebar and UI components ([eec00a1](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eec00a15508c55e1f908bbec333fef8887a554b1)) by @Osama-Qonaibe
* escape CSS selectors for peer-data attributes ([8bcb0b9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8bcb0b92b0fba0c9ce0f00686f8cfbf81844a651)) by @Osama-Qonaibe
* exclude migration scripts from TypeScript build ([ef573df](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ef573dfc0efafa121a5d4ef9d571f9c4f733b360)) by @Osama-Qonaibe
* Export db correctly as alias for pgDb ([026d1a5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/026d1a5a851abe7806198989d1c23034ef6867fc)) by @Osama-Qonaibe
* force RTL text-align for dropdown menu items ([5cab4e7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5cab4e757d87d8096baeea633b8471e3b8920d6f)) by @Osama-Qonaibe
* Get locale from user preferences for email templates ([b82592f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b82592fdd305893f86f9a5a889ca3849553ab80d)) by @Osama-Qonaibe
* grant admin full model access ([f7e6dfa](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f7e6dfa0453c03e430cf832869445baa1c99ac11)) by @Osama-Qonaibe
* handle API response format for authenticated users ([17505cb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/17505cb663107a57f12fe7b5a4ffd0b96a6fde24)) by @Osama-Qonaibe
* Handle async params in Next.js 15+ dynamic routes ([e00645c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e00645c0cd6255aa530b252b58914f58967d3b1c)) by @Osama-Qonaibe
* handle missing limits.images in old plans ([46a578f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/46a578fdcae2990148e351247f41856e4da33504)) by @Osama-Qonaibe
* ignore migration scripts from Vercel build ([ac57b51](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ac57b511b7f3b1ec5385b5e1a64599955097937b)) by @Osama-Qonaibe
* Import PlanWithLimits from plan-service ([de1bc24](https://github.com/Osama-Qonaibe/hebronai-v2/commit/de1bc241a71bd258601e1dc27144c69a5c7c6311)) by @Osama-Qonaibe
* improve mobile responsiveness for RTL ([b0e0a4f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b0e0a4f976a6280050c876a34ddc821086f2de00)) by @Osama-Qonaibe
* improve RTL positioning for absolute elements ([a769e5c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a769e5cfddd008bc2e7e549571972a6b2a539d67)) by @Osama-Qonaibe
* Improve sidebar RTL detection for E2E test stability ([a0b04d3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a0b04d344d8c1f7df095b0bc0e9a2811a75d7acd)) by @CJWTRUST
* Improve Sidebar RTL positioning with correct data-slot selectors ([312efb4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/312efb44f4c7d0711ac6e73774b43f8341b341ba)) by @Osama-Qonaibe
* Locale handling now works on all pages including sign-in ([78f5a57](https://github.com/Osama-Qonaibe/hebronai-v2/commit/78f5a57c04a3c794ad37ab77d1751b00132bf3bb)) by @Osama-Qonaibe
* make forgot password link clickable outside label ([5a45d6d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5a45d6d38d15a9300ec18b6d0a4096b7315fad6d)) by @Osama-Qonaibe
* Make REDIS_URL validation handle empty strings in E2E tests ([3f5dce6](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3f5dce69b0614199f0f8cf188ab91141ccd4e506)) by @CJWTRUST
* match theme button spacing with language button ([5a5a026](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5a5a026681040a1761e1ab3caf3909adcc958520)) by @Osama-Qonaibe
* **migration:** handle nullable user.plan field ([fb4c43b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/fb4c43b9956d19ea65a596d5e913cd177af873cb)) by @Osama-Qonaibe
* Pass correct user props to UserRoleSelector ([e658c37](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e658c3764941d0de9c54fa0952f24bb42feb7a53)) by @Osama-Qonaibe
* phase 1 improvements - linting, security, env validation, biome v2 ([ba27d79](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ba27d7915e656cab33f3f9d8e4f41fc7eb51b255)) by @Osama-Qonaibe
* phase 1 improvements - linting, security, env validation, biome v2 ([2bd497c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2bd497c75f0a46661a317c0d118e37109890f317)) by @Osama-Qonaibe
* professional RTL support for dropdown menu ([6763c3d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6763c3d8a053f083fb5324d63394d5bebe4232ce)) by @Osama-Qonaibe
* Properly handle Arabic text in FlipWords component - display whole words instead of splitting into letters ([d0393e7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d0393e765c91c81a3fcb3c930fb4b4d09a9c6284)) by @Osama-Qonaibe
* reload user data from DB for accurate subscription info ([f9f0ed2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f9f0ed2afc35fa65d6957ea4235938352c1774ab)) by @Osama-Qonaibe
* remove mr-2 from archive icons for consistent alignment ([f3500c8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f3500c89ec8e76cafec72b77693285b58cc2fae3)) by @Osama-Qonaibe
* remove overly broad RTL CSS rules breaking interactivity ([cde4d1d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cde4d1d9b199cbc6a1dafcff96438710c19b8192)) by @Osama-Qonaibe
* Remove seed script from scripts folder ([ac4cdfa](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ac4cdfaa5a9e437a8f2e0fafc8effb6b90ffe59a)) by @Osama-Qonaibe
* remove unused ApiResponse type ([cf7a60f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cf7a60f5ccce166f9f9351ca8ad36d33f56f1944)) by @Osama-Qonaibe
* remove unused Badge import ([a4cb352](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a4cb352042f8881c6e4d9931c7ea9ec5a600a5c7)) by @Osama-Qonaibe
* remove unused ChevronRight import ([0822025](https://github.com/Osama-Qonaibe/hebronai-v2/commit/08220251a680b8b3834b1ddb302aeefa4bb9c09e)) by @Osama-Qonaibe
* remove unused code (AVAILABLE_MODELS, toggleModel) ([a8a1247](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a8a12475d34107fcc5a1920434ececc0f5e89ea1)) by @Osama-Qonaibe
* remove unused ExternalLink import ([2c158da](https://github.com/Osama-Qonaibe/hebronai-v2/commit/2c158dab5ebf821b2125f6bb854c9cd621ca1a21)) by @Osama-Qonaibe
* Remove unused isNull import ([c1fa0d7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c1fa0d70f57e86041de51b7b75db882109c6ad7f)) by @Osama-Qonaibe
* Remove unused useTranslations import from subscription page ([32df81a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/32df81a0cb0051587900711b1ebaefe26154628f)) by @CJWTRUST
* remove unused Workflow import ([c274a1f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c274a1fa79f34a1edd346d10a80ca455e27377b8)) by @Osama-Qonaibe
* Replace hardcoded Arabic text with translation keys in plan-dialog-enhanced ([0738ff4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/0738ff4bf9d64b96862742a13cb921b348da9b8a)) by @Osama-Qonaibe
* replace premium with pro and enterprise in admin repository stats ([ebf4e43](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ebf4e4348ef7ce6934123bf0fe45ccae0644cf43)) by @CJWTRUST
* replace window.open with location.href for PWA compatibility ([339aa52](https://github.com/Osama-Qonaibe/hebronai-v2/commit/339aa52115207b08df10017705ddca3cb3157245)) by @Osama-Qonaibe
* restore complete en.json file ([5310c48](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5310c48dea8dd04fe1b0f701dc8b4c96c10baadb)) by @Osama-Qonaibe
* RTL alignment for SidebarMenuAction (archive button spacing) ([cb3b095](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cb3b0952c6de440c9a521c19130cd0292bf45856)) by @Osama-Qonaibe
* RTL alignment using inline styles only ([e855fec](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e855fec5950e046f7e1bb41208636c06951e9127)) by @Osama-Qonaibe
* RTL archive button - remove left padding ([7da1eaf](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7da1eaf89ab2eb7ed81d7dc1be61128b152e70db)) by @Osama-Qonaibe
* RTL arrows and icons in dropdown menus ([707ae55](https://github.com/Osama-Qonaibe/hebronai-v2/commit/707ae5515733f6b3a74a50fe4310e11976ed32c5)) by @Osama-Qonaibe
* RTL dropdown submenu alignment ([4643bd3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4643bd3c5d16636f8bf2eff6dc11df4a512a50a6)) by @Osama-Qonaibe
* RTL dropdown submenu with important ([8dcd5bf](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8dcd5bf67451b03c6bec3f4958746c7427b2ca9b)) by @Osama-Qonaibe
* RTL for dropdowns only without affecting other text ([431a6eb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/431a6ebcd7e94383124f5e40e933459411ce427e)) by @Osama-Qonaibe
* RTL padding for archive button - remove left padding ([adeade2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/adeade210c3e0802ea6963cb55141d8250f6b346)) by @Osama-Qonaibe
* RTL support for dropdown menu with proper icon placement ([a7cae30](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a7cae30aa9982ecdc147ca0afc74c08cb7640c4a)) by @Osama-Qonaibe
* RTL support for theme toggle button ([3692d7b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3692d7bacc6317a7008019efee5391e440b7abc1)) by @Osama-Qonaibe
* RTL text alignment for sidebar dropdown menu ([73baa18](https://github.com/Osama-Qonaibe/hebronai-v2/commit/73baa184f963681434ebca81efb3e74b81c29040)) by @Osama-Qonaibe
* RTL text alignment in mention input ([746a55c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/746a55c94f391f1f46e66b343d3f0926668e9681)) by @Osama-Qonaibe
* send request first, then open payment gateway ([779692f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/779692ffe8441fe6f7e2a104766a4e4d47cce0da)) by @Osama-Qonaibe
* Simplify fetch and add console logging ([793bcf9](https://github.com/Osama-Qonaibe/hebronai-v2/commit/793bcf9993f83b4647ed06e7422f38e12c8d3aca)) by @Osama-Qonaibe
* Simplify fetch and add console logging for reset ([434e842](https://github.com/Osama-Qonaibe/hebronai-v2/commit/434e8428ca571d1f37fbdd097de332faffe12260)) by @Osama-Qonaibe
* syntax error in Instagram dropdown item ([9980b20](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9980b20454460823c3f0d132e16707dd9c46a359)) by @Osama-Qonaibe
* theme button RTL - remove icon prop ([a735064](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a735064f46f0ef158a5cb528e09242297f293ba8)) by @Osama-Qonaibe
* truncate long model names in mobile view ([ec9bae8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec9bae8897c352b8494aeb8331d59a3e3edcb841)) by @Osama-Qonaibe
* TypeScript error - allow null for preferences ([c26837f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c26837f33e7b2f51fab172894717f193719444c2)) by @Osama-Qonaibe
* **types:** make user.plan nullable in user types ([968e61a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/968e61a28492b9dccaeb27e78405ac7376a40cdc)) by @Osama-Qonaibe
* update BasicUser type to support pro and enterprise plans ([81be81b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/81be81b82a5e78a421a83200692e055c29d2762f)) by @CJWTRUST
* update manifest for Arabic RTL PWA ([977c2f7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/977c2f7421bf99fbbc866f7a173d70f89e0da0a0)) by @Osama-Qonaibe
* Use any type for preferences to avoid TypeScript errors ([32b2d89](https://github.com/Osama-Qonaibe/hebronai-v2/commit/32b2d8994558147b56442157ef8bc7f9011850c7)) by @Osama-Qonaibe
* Use Better Auth client for forgot password ([fb98e07](https://github.com/Osama-Qonaibe/hebronai-v2/commit/fb98e0763a0a6a1d6b5a06392b1725875dee0ff4)) by @Osama-Qonaibe
* use correct auth import for models API route ([df5b866](https://github.com/Osama-Qonaibe/hebronai-v2/commit/df5b866fc6cc92d3c872f7244a928e5c84c194bc)) by @Osama-Qonaibe
* Use correct auth import from server.ts ([96ed41e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/96ed41e1f90053480c6ebd09ba1530c43509f22a)) by @Osama-Qonaibe
* Use correct Better Auth API method name ([5481e4b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5481e4b9f1b3bf4a98b52f9200a17cf8a0eaeb7a)) by @Osama-Qonaibe
* Use correct Better Auth client method - forgetPassword ([f16058e](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f16058e5adf1c483715718686740c69a3b1eeff4)) by @Osama-Qonaibe
* Use correct better-auth method name forgetPassword ([6939b09](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6939b092b6eab5183bc6c4f50046db355d328076)) by @Osama-Qonaibe
* Use correct pgDb import name in all API routes ([aa891fe](https://github.com/Osama-Qonaibe/hebronai-v2/commit/aa891fec219dab0ccbc5f3f1ce70173b453ff437)) by @Osama-Qonaibe
* use correct relative paths without locale prefix ([d49d226](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d49d226557f6424345edd21a01d6862351bffcb2)) by @Osama-Qonaibe
* Use correct SubscriptionPlan type in usePlans hook ([ce75417](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ce7541782a78208a77bde6f03e513c7f3be661d0)) by @Osama-Qonaibe
* Use correct table names from schema ([7d3abf5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7d3abf5844a81ba1295a29ad28aacd9a3065eb93)) by @Osama-Qonaibe
* Use direct API call for reset password ([61da202](https://github.com/Osama-Qonaibe/hebronai-v2/commit/61da202c932a602d50abd4112797a67d5b5b7496)) by @Osama-Qonaibe
* Use direct API call instead of authClient ([9bb0515](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9bb05152f40c421957cb8503712e989547a48993)) by @Osama-Qonaibe
* Use getSession instead of auth() ([18c9a61](https://github.com/Osama-Qonaibe/hebronai-v2/commit/18c9a617017228971aed39b3cd33437e79c7f6bc)) by @Osama-Qonaibe
* use locale-aware routing for forgot password link ([c7ef982](https://github.com/Osama-Qonaibe/hebronai-v2/commit/c7ef9827800dceb5aaa5b7c9f2f4bd38bf43e04e)) by @Osama-Qonaibe
* Use proper UserPreferences type for notifications ([07b690a](https://github.com/Osama-Qonaibe/hebronai-v2/commit/07b690a61e0e4e97355e55a58a292b68d69ab171)) by @Osama-Qonaibe
* Use requestPasswordReset from Better Auth ([a7821a2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a7821a2382e4556fbeb8c7c4a84501f95504834f)) by @Osama-Qonaibe
* Use requestPasswordReset from Better Auth client ([b06efec](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b06efecfc96cbf956bd1db1c039c90530c2570cf)) by @Osama-Qonaibe
* use short display names in prompt input model selector ([51abe66](https://github.com/Osama-Qonaibe/hebronai-v2/commit/51abe666624ee64fe3d2c14a1955789d83b6c6bb)) by @Osama-Qonaibe
* use sonner toast instead of non-existent use-toast ([28e2753](https://github.com/Osama-Qonaibe/hebronai-v2/commit/28e27537c1c72c36921c16cb28c1d54bc75f61d5)) by @Osama-Qonaibe
* Use type assertion for plan insertion to avoid TypeScript errors ([eda462f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/eda462f17554c75ad62b14e5cb2dd4b3f73dd816)) by @Osama-Qonaibe
* use useLocale hook instead of useParams for routing ([7146ff5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7146ff5f9312d2fa91ce635365a3e13d252f2ea7)) by @Osama-Qonaibe
* Use user.preferences.locale for all email notifications ([1d419ea](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1d419ead74e42af83961b39ee04337a119de4dc0)) by @Osama-Qonaibe


### Reverts

* Remove API route ([4352456](https://github.com/Osama-Qonaibe/hebronai-v2/commit/435245639c4f8bb6af24848d67726e7ea783b1f5)) by @Osama-Qonaibe
* Remove documentation ([7608ae5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7608ae5ab4946e89e890a309a47d4797ff803932)) by @Osama-Qonaibe
* Remove migration files ([9570749](https://github.com/Osama-Qonaibe/hebronai-v2/commit/95707498ed58e4578087754c1dd023d2460512c6)) by @Osama-Qonaibe
* Remove migration files (2) ([d94be85](https://github.com/Osama-Qonaibe/hebronai-v2/commit/d94be85d8a006249cc809e6a57a284dd5072545b)) by @Osama-Qonaibe
* Remove PostgreSQL storage implementation ([a80e8da](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a80e8daf4adb4500a46acfee13b17a9d7e870b81)) by @Osama-Qonaibe
* Restore original files and remove all PostgreSQL storage changes ([dd96003](https://github.com/Osama-Qonaibe/hebronai-v2/commit/dd9600357bbed1b2d2f9c0fcc5ba6fa9e6890eb8)) by @Osama-Qonaibe
* Restore original schema.pg.ts ([a4b1812](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a4b18125c6f3ae3844b2f5d773948cbd5f70a904)) by @Osama-Qonaibe
* restore subscription workflow - fix payment dialog and database caching ([87f303c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/87f303c645ab2b57dc294f903140ed3281edf43d)) by @Osama-Qonaibe
* restore working RTL dropdown menu ([a1a5de0](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a1a5de0d75425e87b089b6a4491875e4703affce)) by @Osama-Qonaibe

## [4.2.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.1.0...hebronai-v2-v4.2.0) (2026-03-02)


### Features

* cleaner and shorter model display names ([b6f8af4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/b6f8af4c2d786f5f179b95a60ec69fb41b7b443a)) by @Osama-Qonaibe
* use short display names in model selector ([a26aad2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a26aad2fe276d6899bbecb109b84d1b432a35eed)) by @Osama-Qonaibe
* use short display names in plan models selector ([319e4c2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/319e4c2f0487c160fb2574739c9c0c9018f166ea)) by @Osama-Qonaibe


### Bug Fixes

* truncate long model names in mobile view ([ec9bae8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec9bae8897c352b8494aeb8331d59a3e3edcb841)) by @Osama-Qonaibe
* use short display names in prompt input model selector ([51abe66](https://github.com/Osama-Qonaibe/hebronai-v2/commit/51abe666624ee64fe3d2c14a1955789d83b6c6bb)) by @Osama-Qonaibe

## [4.1.0](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.11...hebronai-v2-v4.1.0) (2026-03-02)


### Features

* add model display names for compact UI ([39ef573](https://github.com/Osama-Qonaibe/hebronai-v2/commit/39ef573a74e952c60025488603595cba7c97bf12)) by @Osama-Qonaibe

## [4.0.11](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.10...hebronai-v2-v4.0.11) (2026-03-02)


### Bug Fixes

* RTL text alignment in mention input ([746a55c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/746a55c94f391f1f46e66b343d3f0926668e9681)) by @Osama-Qonaibe

## [4.0.10](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.9...hebronai-v2-v4.0.10) (2026-03-02)


### Bug Fixes

* complete ar.json file - add missing closing braces and Chat section ([8e5015f](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8e5015f6a113dd2f1be920499eeb63637198e0fd)) by @Osama-Qonaibe

## [4.0.9](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.8...hebronai-v2-v4.0.9) (2026-03-02)


### Bug Fixes

* agents button RTL alignment - match other buttons padding ([38b9bd4](https://github.com/Osama-Qonaibe/hebronai-v2/commit/38b9bd47b3da14c4eda8c63b34be3fe94dd98639)) by @Osama-Qonaibe
* archive button RTL alignment - match workflow button padding ([f9c902b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f9c902b2ab543024852429d77a64d12dd2961980)) by @Osama-Qonaibe

## [4.0.8](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.7...hebronai-v2-v4.0.8) (2026-03-02)


### Bug Fixes

* add RTL support for SidebarMenuButton icon alignment ([006b7f3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/006b7f37f9d65f46e23d2e7b2ab75b192bfc9c93)) by @Osama-Qonaibe
* correct RTL alignment - keep icons on right without reversing order ([1dafecb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/1dafecb690fc7b281dd45826970e75136ac2b3ec)) by @Osama-Qonaibe
* RTL alignment for SidebarMenuAction (archive button spacing) ([cb3b095](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cb3b0952c6de440c9a521c19130cd0292bf45856)) by @Osama-Qonaibe
* RTL archive button - remove left padding ([7da1eaf](https://github.com/Osama-Qonaibe/hebronai-v2/commit/7da1eaf89ab2eb7ed81d7dc1be61128b152e70db)) by @Osama-Qonaibe
* RTL padding for archive button - remove left padding ([adeade2](https://github.com/Osama-Qonaibe/hebronai-v2/commit/adeade210c3e0802ea6963cb55141d8250f6b346)) by @Osama-Qonaibe

## [4.0.7](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.6...hebronai-v2-v4.0.7) (2026-03-01)


### Bug Fixes

* archive button icon alignment ([5e107e5](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5e107e5e628dc73beeacb61b5b7587b0c8264909)) by @Osama-Qonaibe
* remove mr-2 from archive icons for consistent alignment ([f3500c8](https://github.com/Osama-Qonaibe/hebronai-v2/commit/f3500c89ec8e76cafec72b77693285b58cc2fae3)) by @Osama-Qonaibe
* remove unused ChevronRight import ([0822025](https://github.com/Osama-Qonaibe/hebronai-v2/commit/08220251a680b8b3834b1ddb302aeefa4bb9c09e)) by @Osama-Qonaibe
* theme button RTL - remove icon prop ([a735064](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a735064f46f0ef158a5cb528e09242297f293ba8)) by @Osama-Qonaibe

## [4.0.6](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.5...hebronai-v2-v4.0.6) (2026-03-01)


### Bug Fixes

* add RTL support to Palette icon in theme button ([ec6a6be](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ec6a6be3a0d231057bdec13022cf2c37b9f3f2cb)) by @Osama-Qonaibe
* add spacing between text and arrow in theme button ([cf36f3c](https://github.com/Osama-Qonaibe/hebronai-v2/commit/cf36f3c71ac79df53167dd9c7954645e39368542)) by @Osama-Qonaibe
* complete RTL support for all UI elements ([9a30391](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9a30391c7a453243739e94fd8b43caa332c8726d)) by @Osama-Qonaibe
* complete RTL support for theme button icons ([ef4df55](https://github.com/Osama-Qonaibe/hebronai-v2/commit/ef4df55cf3a60788a671cf65bd1c1de8234720c0)) by @Osama-Qonaibe
* correct RTL selectors for dropdown menu ([5e6a286](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5e6a2863646b52540091f9f3a01eb2d070671b6c)) by @Osama-Qonaibe
* match theme button spacing with language button ([5a5a026](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5a5a026681040a1761e1ab3caf3909adcc958520)) by @Osama-Qonaibe
* professional RTL support for dropdown menu ([6763c3d](https://github.com/Osama-Qonaibe/hebronai-v2/commit/6763c3d8a053f083fb5324d63394d5bebe4232ce)) by @Osama-Qonaibe
* RTL support for theme toggle button ([3692d7b](https://github.com/Osama-Qonaibe/hebronai-v2/commit/3692d7bacc6317a7008019efee5391e440b7abc1)) by @Osama-Qonaibe
* syntax error in Instagram dropdown item ([9980b20](https://github.com/Osama-Qonaibe/hebronai-v2/commit/9980b20454460823c3f0d132e16707dd9c46a359)) by @Osama-Qonaibe


### Reverts

* restore working RTL dropdown menu ([a1a5de0](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a1a5de0d75425e87b089b6a4491875e4703affce)) by @Osama-Qonaibe

## [4.0.5](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.4...hebronai-v2-v4.0.5) (2026-03-01)


### Bug Fixes

* RTL text alignment for sidebar dropdown menu ([73baa18](https://github.com/Osama-Qonaibe/hebronai-v2/commit/73baa184f963681434ebca81efb3e74b81c29040)) by @Osama-Qonaibe

## [4.0.4](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.3...hebronai-v2-v4.0.4) (2026-03-01)


### Bug Fixes

* force RTL text-align for dropdown menu items ([5cab4e7](https://github.com/Osama-Qonaibe/hebronai-v2/commit/5cab4e757d87d8096baeea633b8471e3b8920d6f)) by @Osama-Qonaibe
* RTL alignment using inline styles only ([e855fec](https://github.com/Osama-Qonaibe/hebronai-v2/commit/e855fec5950e046f7e1bb41208636c06951e9127)) by @Osama-Qonaibe
* RTL support for dropdown menu with proper icon placement ([a7cae30](https://github.com/Osama-Qonaibe/hebronai-v2/commit/a7cae30aa9982ecdc147ca0afc74c08cb7640c4a)) by @Osama-Qonaibe

## [4.0.3](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.2...hebronai-v2-v4.0.3) (2026-03-01)


### Bug Fixes

* RTL arrows and icons in dropdown menus ([707ae55](https://github.com/Osama-Qonaibe/hebronai-v2/commit/707ae5515733f6b3a74a50fe4310e11976ed32c5)) by @Osama-Qonaibe
* RTL dropdown submenu with important ([8dcd5bf](https://github.com/Osama-Qonaibe/hebronai-v2/commit/8dcd5bf67451b03c6bec3f4958746c7427b2ca9b)) by @Osama-Qonaibe
* RTL for dropdowns only without affecting other text ([431a6eb](https://github.com/Osama-Qonaibe/hebronai-v2/commit/431a6ebcd7e94383124f5e40e933459411ce427e)) by @Osama-Qonaibe

## [4.0.2](https://github.com/Osama-Qonaibe/hebronai-v2/compare/hebronai-v2-v4.0.1...hebronai-v2-v4.0.2) (2026-03-01)


### Bug Fixes

* RTL dropdown submenu alignment ([4643bd3](https://github.com/Osama-Qonaibe/hebronai-v2/commit/4643bd3c5d16636f8bf2eff6dc11df4a512a50a6)) by @Osama-Qonaibe
