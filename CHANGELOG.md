# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

___Note:__ Yet to be released changes appear here._

* ...

## 1.0.1

* `FIX`: remove empty text boxes on cancel editing ([#20](https://github.com/pinussilvestrus/postit-js/issues/20))
* `FIX`: add missing moddle descriptors to published package ([#95](https://github.com/pinussilvestrus/postit-js/issues/95))
* `CHORE`: various dependency updates

## 1.0.0

* `FEAT`: switch from callbacks to Promises ([`bf699810`](https://github.com/pinussilvestrus/postit-js/commit/bf6998100f52ce50f7fdd498c31e002a83e50968))
* `CHORE`: add basic tests infrastructure ([`1ea64c90`](https://github.com/pinussilvestrus/postit-js/commit/1ea64c9012e2a0849c367cd0a39d981b2d336bf9))
* `CHORE`: migrate CI to GitHub actions ([`b512c6c4`](https://github.com/pinussilvestrus/postit-js/commit/b512c6c4f815d082da70304834ce3eebbfc1d856))
* `CHORE`: remove unused global connect tool ([`5016d943`](https://github.com/pinussilvestrus/postit-js/commit/5016d94325624a55dcf5dae026e195a1c94a7239))
* `CHORE`: rename default branch to `main`
* `CHORE`: bump to `diagram-js@7.2`
* `CHORE`: bump to `moddle-xml@9`

### Breaking Changes

* APIs don't accept callbacks anymore, instead, they return a Promise now
  * `viewer#importXML`
  * `viewer#importDefinitions`
  * `viewer#open`
  * `viewer#saveXML`
  * `viewer#saveSVG`
  * `modeler#createDiagram`
  * `importer#importPostitDiagram`

## 0.6.2

* `CHORE`: fix travis

## 0.6.1

* `CHORE`: remove examples from package

## 0.6.0

* `FEAT`: improve image selection ([#17](https://github.com/pinussilvestrus/postit-js/issues/17))
* `CHORE`: examples cleanups

## 0.5.0

* `FEAT`: delete empty text boxes ([#6](https://github.com/pinussilvestrus/postit-js/issues/6))
* `FIX`: transparent background when editing post-it elements ([#4](https://github.com/pinussilvestrus/postit-js/issues/4))

## 0.4.0

* `FEAT`: ability to re-configure image source ([#18](https://github.com/pinussilvestrus/postit-js/issues/18))
* `CHORE`: update bpmn.io logo

## 0.3.0

* `FEAT`: add image element support ([#11](https://github.com/pinussilvestrus/postit-js/issues/11))

## 0.2.0

* `CHORE`: first npm release, add integration instructions

## 0.1.1

* `FIX`: ability to delete elements created directly on canvas ([#12](https://github.com/pinussilvestrus/postit-js/issues/12))

## 0.1.0

Initial release