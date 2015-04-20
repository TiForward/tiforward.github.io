---
title: Sunday recap №1
lead: What happened during the last week
author: yuchi
date: Apr 12, 2015
---

Welcome to the first of a series of Journal posts devoted to summarize the
[discussions][discuss] that happened in the last week.

[discuss]: https://github.com/TiForward/discuss/issues

- - -

### Accessing the platform SDK native APIs

- [`#1` JS runtime access to 100% of all native APIs, including any 3rd party SDKs added][issue-1]
- [`#2` The Titanium Mobile API written in JS][issue-2]

Because currently we’re limited to what the Titanium™ SDK offers in terms of
supported platform APIs, it happens more often than liked that developers hit
an hard wall when trying to do things not covered.

Also sometimes the architecture is not performant enough and we are in fact
limited in what we can do. This is expecially true when talking about intensive
animations, e.g. parallax scrolling.

As a provocative idea in [`#2`][issue-2] we are discussing the idea of having
Titanium™ SDK itself written in JS. This would be a major win point in letting
the community (mostly made by JS developers) understanding and helping in the
internals of the SDK.

As we try to recap and bring order to the discussion we can extract the
following sub-topics:

- How do we lower the barrier for the community to contribute back to the SDK?
- How can we reduce the limits of what it’s possible in user-land?
- Do we want to make platforms APIs fully available in JS-land?
- If yes, wouldn’t building Titanium™ SDK directly in JS, and therefore
  dog-fooding on the architecture, be the best way to make it solid?

As this is a very felt pain point, it was expected to have a lot of traction.

- - -

### Layout engine

- [`#6` Layout engine][issue-6]

Another topic with a lot of traction is the one related to the Layout System.

This is a very delicate topic, because it happens to touch both the developer
experience and our ability to use platform UI APIs.

In fact from one side we want to be able to use the underlying Layout System
provided by the platform, as it is required for 3rd party widgets for example,
but from the other side we both want to write cross-platform UIs and with a
cross-platform ‘language’.

Some interesting arguments have been made:

- Do we need to support [Titanium’s current Layout System](http://docs.appcelerator.com/titanium/latest/#!/guide/Transitioning_to_the_New_UI_Layout_System)?
- Do we need to have access to native Layout System? (Android’s LayoutParams, Cocoa Autolayout)
- Which Layout System will be the one to write cross-platform UIs in Ti.Next?

- - -

### Asynchronous APIs

- [`#3` Async approach (developer experience)][issue-3]
- [`#4` Async approach (low level architecture)][issue-4]

With less traction and discussion I personally hoped for, there are two issues
related to the async approach we’re gonna take.

I hoped to have more people to chime in because I personally think that this
topic which could carve a solution for a lot of other seemingly unrelated ones,
like UI changes’ performance.

- - -

### EcmaScript 2015 (ES6)

- [`#8` How important is ES6/JavaScript 2015 support?][issue-8]

Not a lot has been expressed, only a lot of questions (and good ones!) but I believe that this topic deserves a lot of attention.

Please go to [the discussion page][issue-8] and express your feelings and ideas
on the topic.

To summarize, there we talk about:

- Will ES2015 be a *requirement* for Ti.Next?
- Will ES2015 be the goto language for examples, docs etc.?
- Are we ok with a transpilation pass?

- - -

### Other discussions

- [`#7` Platform code separation][issue-7]

  What do you prefer? `Resources/android/app.js` or `Resources/app.android.js`?
  Chime in to express your preference!

- [`#5` Dependencies (Modules and packages)][issue-5]

  We discussed some ideas about packages and modules. A lot still to do there!


[issue-1]: https://github.com/TiForward/discuss/issues/1
[issue-2]: https://github.com/TiForward/discuss/issues/2
[issue-3]: https://github.com/TiForward/discuss/issues/3
[issue-4]: https://github.com/TiForward/discuss/issues/4
[issue-5]: https://github.com/TiForward/discuss/issues/5
[issue-6]: https://github.com/TiForward/discuss/issues/6
[issue-7]: https://github.com/TiForward/discuss/issues/7
[issue-8]: https://github.com/TiForward/discuss/issues/8
