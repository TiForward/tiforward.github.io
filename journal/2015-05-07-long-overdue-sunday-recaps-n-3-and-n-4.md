---
title: Long overdue Sunday recaps №3 and №4
lead: What happened during the last weeks
author: yuchi
date: May 7, 2015
---

Welcome to the third post of a series devoted to summarize the
[discussions][discuss] that happened in the last weeks.

This one has been drafted by [Andrew][Sophrinix].

[discuss]: https://github.com/TiForward/discuss/issues
[Sophrinix]: https://github.com/Sophrinix

- - -

### Roadmap

- [`#13` Roadmap (aka "the first and most important thing to do" or "focus")][issue-13]

There has been some discussion over how we’ll settle the roadmap. The major
pain point is that it’s not clear neither the *how* we’re gonna reach our goals,
nor the *when*.

We need to get an effective rythm, commit after commit, execution after
execution. We can expect a (physical or virtual) meetup will help a lot.

At small steps we’re moving, but this takes us to the next point…

- - -

### HAL on iOS

- [Branch `ios-WIP` on `TiForward/HAL`](https://github.com/TiForward/HAL/tree/ios-WIP)

Thanks to Olivier and Matt, there’s a working HAL on iOS setup, also supported
by [Kota’s contribution][https://github.com/TiForward/discuss/issues/13#issuecomment-95396357].

The next one is Android of course!

- - -

### Android

Android is a little more complex than iOS and Windows, because we have to
orchestrate two virtual machines (JS and Java).

The old Hyperloop iteration from Summer 2014 runs perfectly now thanks to small
yet [important note from Josh][hl-droid], and we’ll try to steal everything we
can from it :)

[hl-droid]: https://github.com/appcelerator/hyperloop-android/issues/14#issuecomment-90740480

- - -

### iOS Project Layout

- [`#14` iOS Project Layout][issue-14]

Because we now have HAL working on iOS we can also try project layouts in
mocked up Ti.Next applications (yay!)

This means that we have a way to test realistic projects, very similar in
directories’ structure and architecture to what Ti.Next will use, but with a lot
of manual wiring required.

There are some interesting questions in the [issue][issue-14]:

- Will HAL be available as a pre-compiled library? (probably yes)
- Will the SDK and the app be two different Xcode projects?
- Will the native project be built as it is now, or will it be part of the source of the app?

Matt took some time and defined two approaches that answer those questions.

Please take your time and review them, and eventually add a third!

- - -

### Colophon

This was a long overdue recap, but the news in it are good.

See you later on the chats!

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
[issue-13]: https://github.com/TiForward/discuss/issues/13
[issue-14]: https://github.com/TiForward/discuss/issues/14
