---
title: Sunday recap №2
lead: What happened during the last week
author: yuchi
date: Apr 19, 2015
---

Welcome to the second post of a series devoted to summarize the
[discussions][discuss] that happened in the last week.

[discuss]: https://github.com/TiForward/discuss/issues

- - -

### Tooling

- [`#9` Titanium code editor with built-in TiShadow/CLI/Alloy support/Code completion][issue-9]

Great discussion about how and which kind of tooling do we expect from a purely
OSS environment for Titanium SDK.

Some interesting debate on how deep the integration between the editor and the
SDK must be, in other words: an full-blown IDE or a set of plugins?

The final words are yet to be told, but the path that’s ahead looks split in
two different directions: a lightweight set of integrations build by the
community and full-blown IDE, with a tuned developer experience, in the form
of the Appcelerator® Studio.

- - -

### EcmaScript 2015 (ES6)

- [`#8` How important is ES6/JavaScript 2015 support?][issue-8]

The discussion didn’t actually moved a lot, **but it should!**

So [go ahead][issue-8] and express your feelings!

Also if you want to have some fun **now** have a look at these interesting
projects that carve the way:

- for Alloy there’s @dbankier’s [JAST](https://github.com/dbankier/JAST)
- for Classic there’s @smclab’s [Titaniumifier in host-mode](https://github.com/smclab/titaniumifier/wiki/Host-mode#usage-with-babeljs)

And some experimental ones:

- for Classic there’s an experiment from @rblalock called [es6_titanium_classic](https://github.com/rblalock/es6_titanium_classic)
- for Classic there’s also the experimental [ti.babel](https://github.com/dawsontoth/ti.babel) from @dawsontoth

- - -

### Accessing the platform SDK native APIs

- [`#1` JS runtime access to 100% of all native APIs, including any 3rd party SDKs added][issue-1]
- [`#2` The Titanium Mobile API written in JS][issue-2]

This one got a lot attention! [Since this comment on `#2`][jh-comment-on-apis] we really
dig into the technical challenges and the state of the project.

It’s probably the real core of this week discussions. What are you doing still
here? [Go read it!][issue-2]

[jh-comment-on-apis]: https://github.com/TiForward/discuss/issues/2#issuecomment-93142598

- - -

### Ti.Forward Developer Day

- [`#11` Developer Day][issue-11]

There’s this fantastic idea of having a real, concrete meetup the near future
to ‘talk code’ and flesh things out.

We‘re currently concerned of making it big enough to have the required energy
but small enough to not explode in too many bike-shedding.

[Help us solve this *impasse*][issue-11] and share your ideas!

- - -

### Backwards compatibility

- [`#12` Backwards compatibility][issue-12]

Will Ti.Next be a slow transformation from the current APIs? Will it be a
completely different set?

Those are the questions we’re trying to target in [`#12`][issue-12], and some
interesting proposals have been made.

The one I personally find more intriguing is to have the current Titanium™ SDK
APIs implemented **on top** of the Ti.Next APIs, and in the user-land. This
would let use focus on the future, and having the compatibility layer’s
releases independent from the core.

Not sold? [Tell us so!][issue-12]

- - -

### Colophon

A great week. I look *forward* the *next* one.

[issue-1]: https://github.com/TiForward/discuss/issues/1
[issue-2]: https://github.com/TiForward/discuss/issues/2
[issue-3]: https://github.com/TiForward/discuss/issues/3
[issue-4]: https://github.com/TiForward/discuss/issues/4
[issue-5]: https://github.com/TiForward/discuss/issues/5
[issue-6]: https://github.com/TiForward/discuss/issues/6
[issue-7]: https://github.com/TiForward/discuss/issues/7
[issue-8]: https://github.com/TiForward/discuss/issues/8
[issue-9]: https://github.com/TiForward/discuss/issues/9
[issue-11]: https://github.com/TiForward/discuss/issues/11
[issue-12]: https://github.com/TiForward/discuss/issues/12
