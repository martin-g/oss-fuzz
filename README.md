# OSS-Fuzz - Continuous Fuzzing for Open Source Software

> *Status*: Beta. We are preparing the project for public release soon.

[FAQ](docs/faq.md)
| [Ideal Fuzzing Integration](docs/ideal_integration.md)
| [New Target Guide](docs/new_target.md) 
| [Reproducing Bug Reports](docs/reproducing.md) 
| [Targets List](targets)
| [Targets Issue Tracker](https://bugs.chromium.org/p/oss-fuzz/issues/list)


[Create New Issue](https://github.com/google/oss-fuzz/issues/new) for questions or feedback about OSS-Fuzz.

## Introduction

[Fuzz testing](https://en.wikipedia.org/wiki/Fuzz_testing) is a well-known
technique for uncovering various kinds of programming errors in software.
Many of these detectable errors (e.g. [buffer overflow](https://en.wikipedia.org/wiki/Buffer_overflow)) can have serious security implications.

We successfully deployed 
[guided in-process fuzzing of Chrome components](https://security.googleblog.com/2016/08/guided-in-process-fuzzing-of-chrome.html)
and found [hundreds](https://bugs.chromium.org/p/chromium/issues/list?can=1&q=label%3AStability-LibFuzzer+-status%3ADuplicate%2CWontFix) of security vulnerabilities and stability bugs. We now want to share the experience and the service with the open source community. 

In cooperation with the [Core Infrastructure Initiative](https://www.coreinfrastructure.org/), 
OSS-Fuzz aims to make common open source software more secure and stable by
combining modern fuzzing techniques and scalable
distributed execution.

At the first stage of the project we use
[libFuzzer](http://llvm.org/docs/LibFuzzer.html) with
[Sanitizers](https://github.com/google/sanitizers). More fuzzing engines will be added later.
[ClusterFuzz](docs/clusterfuzz.md)
provides distributed fuzzer execution environment and reporting.

## Process Overview

The following process is used for targets in OSS-Fuzz:

- A maintainer of an opensource project or an outside volunteer creates
one or more [fuzz targets](http://libfuzzer.info/#fuzz-target) 
and [integrates](docs/ideal_integration.md) them with the project's build and test system.
- These fuzz targets are [accepted to OSS-Fuzz](#accepting-new-targets).
- When [ClusterFuzz](docs/clusterfuzz.md) finds a bug, an issue is automatically
  reported in the OSS-Fuzz [issue tracker](https://bugs.chromium.org/p/oss-fuzz/issues/list) 
  ([example](https://bugs.chromium.org/p/oss-fuzz/issues/detail?id=9)).
  ([Why different tracker?](docs/faq.md#why-do-you-use-a-different-issue-tracker-for-reportig-bugs-in-fuzz-targets)).
  Project owners are CC-ed to the bug report.
- The bug is fixed upstream.
- [ClusterFuzz](docs/clusterfuzz.md) automatically verifies the fix, adds a comment and closes the issue ([example](https://bugs.chromium.org/p/oss-fuzz/issues/detail?id=53#c3)).
- 7 days after the fix is verified or after 90 days after reporting, the issue becomes *public*
  ([guidelines](#bug-disclosure-guidelines)).

<!-- NOTE: this anchor is referenced by oss-fuzz blog post -->
## Accepting New Targets

To be accepted to OSS-Fuzz, an open-source target must 
have a significant user base and/or be critical to the global IT infrastructure.
To submit a new target:
- [Create a pull request](https://help.github.com/articles/creating-a-pull-request/) with new 
`targets/<target_name>/target.yaml` file ([example](targets/file/target.yaml)) giving at least the following information:
  * target homepage.
  * e-mail of the engineering contact person to be CCed on new issues. This
    email should be  
    [linked to a Google Account](https://support.google.com/accounts/answer/176347?hl=en)
    and belong to an established target committer (according to VCS logs).
    If this is not you or the email address differs from VCS, an informal e-mail verification will be required.
- Once accepted by an OSS-Fuzz project member, follow the [New Target Guide](docs/new_target.md)
  to write the code.


## Bug Disclosure Guidelines

Following [Google's standard disclosure policy](https://googleprojectzero.blogspot.com/2015/02/feedback-and-data-driven-updates-to.html)
OSS-Fuzz will adhere to following disclosure principles:
  - **90-day deadline**. After notifying target authors, we will open reported
    issues in 90 days, or 7 days after the fix is released.
  - **Weekends and holidays**. If a deadline is due to expire on a weekend or
    US public holiday, the deadline will be moved to the next normal work day.
  - **Grace period**. We have a 14-day grace period. If a 90-day deadline
    expires but the upstream engineers lets us know before the deadline that a
    patch is scheduled for release on a specific day within 14 days following
    the deadline, the public disclosure will be delayed until the availability
    of the patch.

## More Documentation

* [New Target Guide](docs/new_target.md) walks through the steps necessary to add new targets to OSS-Fuzz.
* [Ideal Integration](docs/ideal_integration.md) describes the steps to integrate fuzz targets with your project.
* [Fuzzer execution environment](docs/fuzzer_environment.md) documents the
  environment under which your fuzzers will be run.
* [Targets List](targets) lists OSS targets currently added to OSS-Fuzz.
* [Chrome's Efficient Fuzzer Guide](https://chromium.googlesource.com/chromium/src/testing/libfuzzer/+/HEAD/efficient_fuzzer.md) 
  while contains some chrome-specifics, is an excellent documentation on making your fuzzer better.

## Build Status
[This page](https://oss-fuzz-build-logs.storage.googleapis.com/status.html)
gives the latest build logs for each target.

## Trophies

[This page](https://bugs.chromium.org/p/oss-fuzz/issues/list?can=1&q=status%3AFixed%2CVerified+Type%3ABug%2CBug-Security+-component%3AInfra+)
gives a list of publically viewable (fixed) bugs found by OSS-Fuzz.

## References
* [libFuzzer documentation](http://libfuzzer.info)
* [libFuzzer tutorial](http://tutorial.libfuzzer.info)
* [Chromium Fuzzing Page](https://chromium.googlesource.com/chromium/src/testing/libfuzzer/)
* [ClusterFuzz](https://blog.chromium.org/2012/04/fuzzing-for-security.html)

