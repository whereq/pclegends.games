---
id: where-the-games-come-from
title: "Where the games come from"
description: "The archive the bundles were mirrored from, where the categories come from, and what the downloads are."
slug: /where-the-games-come-from
---

## The archive

The bundles are mirrored from the archive of Chinese DOS games published by
the [chinese-dos-games](https://github.com/rwv/chinese-dos-games) project.

The download button on a page links straight at that archive — the same
file, byte for byte, and the SHA-256 printed on the page is the archive's
own checksum. There is no second copy here: the file the reader downloads
is the file the page describes, and a reader who wants to check the copy
has the number to check it against.

## The categories

A game's category comes from that project's own manifest, which carries a
type code for every game it knows. That code is the game's primary
category, and the page does not second-guess it.

Where the same project publishes a description that names a further genre,
the game is listed under that one as well. A game can be in two categories,
and where it is, it is listed under both — the counts in the catalogue add
up to more than the number of games for exactly that reason.

The manifest decides the first category. A description may add a second.
Neither ever takes a category away.

## The pictures and the Wikipedia articles

The picture on a card is the game's own — the cover art or the screenshot
from its Wikipedia article — and the game's page links to that article, so a
reader who wants to know more can go and read more.

Both come from Wikipedia, and neither is taken on trust. A search for a
game's name turns up whatever else carries that name: the film *Jurassic
Park*, the song *Danger Zone*, the bomber *Boeing B-17 Flying Fortress*. So
every article is checked before it is used. It has to be about a game — the
description Wikipedia writes under the title settles it, "1992 video game"
against "American heavy bomber aircraft" — it has to carry the game's name,
and it has to be about the right years. An article that fails any of those
checks is not used, and the game keeps the letter on a plate instead.

Where Wikipedia has no article for a game, the card shows the letter on a
plate and the page carries no link. That is the honest outcome: a card that
showed the wrong game's box would be worse than one that showed no box.

## The generated pages

Every page except five is generated from its bundle by a script in the
[site repository](https://github.com/whereq/pclegends.games). The script
reads each bundle — the file list, the file dates, the strings inside the
entry point — and writes a module per game. Regenerating produces the same
pages it produced last time, so a page does not change under a reader's
feet because somebody re-ran the script.

The five games that have been played through on an emulator are written by
hand instead, and are on the [played-through shelf](/played).

## What the downloads are

They are the work of their authors and publishers, who hold the rights in
them. Publishing them here for study, communication and preservation claims
none of those rights and waives none of them.

If you believe a download here breaks a licence, a copyright or any other
right, write to [whereq@gmail.com](mailto:whereq@gmail.com) and
it will be taken down. The same goes for a bundle that is missing
something — say so in the comments and it will be replaced.
