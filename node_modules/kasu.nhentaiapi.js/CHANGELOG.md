# 2.9.2
Hotfix and code update

- reduced the file size again by cleaning the codes.
- `pRandom` is now fixed from giving `link is not defined` error message.
- last 2.9.0 the json object that showed on the readme is fixed and available to all pRand functions. 
- updated the `fetcher.js`.

# 2.9.0

## New Update
### Added new `IsDiscord`
* It blocks some selected tags that violate Discord rules.
If the doujin has those tags it will throw an error. So that you will need to
execute another one again until that doujin has a clean tags.
- Added the `ReRollonFail` bool for this specific new feature.
- this feature is credited to [crackheadakira](https://github.com/crackheadakira)
`getID()` update:
- the function `list()` is now removed so you can now only use 1 function `json()`
this will cause changes on some codes that uses `list()` like `data.cover` is now `data.images.cover` see more on the [README](https://github.com/IchimakiKasura/kasu.nhentaiapi.js/blob/main/README.md) page 
- You can now download the mini file version of this 2.9 [here](https://github.com/IchimakiKasura/kasu.nhentaiapi.js/releases/tag/2.9.0)

- Problem right now after publishing 2.9:<br>
the function `pRandom` has something weird saying `link is not defined` this will be fixed soon
    
# 2.8.1

Code update

* Cleaned some trash code I've done like the 7 while statements on the ``shorter.js`` into a single
for statement. like removing 1kb  from 3.86kb to 2.99kb* and Codes that repeats with same function but 
different names has calling function so less space.

# 2.7.6

Quick Patch 

* ``main.d.ts`` is finally fixed, I don't know how to use typescript but adding them so functions have meanings or 
how they work. I don't know? Im not an expert.

# 2.7.5

Quick Hotfix Patch 

* removed the ``console.log`` on the ``pRandSpecificTags()``.

# 2.7.4

Patch update

* updated: README.md
* FIXED: ``pRandSpecificTags()``. if the nhentai page has 0 it causes an error because it can't compute to randomize it fixed by adding a ``try`` and ``catch``.
* added Throw error when the given ID is invalid to make it easier to create custom errors using `try and catch`

# 2.7.3

Patch update

* updated: README.md
* added my self-made discord bot called "nhentai-roulette" using this api.

# 2.7.2

Quick Hotfix Patch 

* FIXED: ``main.js`` url is accidentally put to ``${url}`` instead of the link.

# 2.7.0

Minor update

* Fixed some typos on the [readme.md](https://github.com/IchimakiKasura/kasu.nhentaiap.js#readme)
* ``Randrange.js`` is too short so it has been removed but the contents has been transfered to the ``main.js``
* added few more testing on ``test.js`` to make sure everything works.
* added changelog :>

# 2.5.4 

Update

* added github repos :> correct my codes! or add more?

# 2.5.2

Patch update

* Fixed some typos on the [readme.md](https://github.com/IchimakiKasura/kasu.nhentaiap.js#readme)

# 2.5.0

Not really a major update but why not

* Fixed the ``.json()`` where the page array is ``undefined``
* added ``d.ts`` idk what that does but yeah you should see what kinda of function does 

# 2.0.0

Not really a major update but why not

* some new stuff

# 1.0.3

Patch update

* Fixed ``.json()`` data picture pages call
```js
//old
data.BASE.IMAGES.THUMBS[0]
//new
data.base.images.page_pic[0]
```

# 1.0.1

Patch update

* Fixed some typos on the [readme.md](https://github.com/IchimakiKasura/kasu.nhentaiap.js#readme)


# 1.0.0

The Creation

* added tons