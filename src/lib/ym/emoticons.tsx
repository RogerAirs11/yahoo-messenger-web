'use client';

import React from 'react';

/* ------------------------------------------------------------------ */
/* The real Yahoo! Messenger emoticon set — 118 original animated GIFs */
/* recovered from Yahoo's CDN, mapped to their official YM shortcuts.  */
/* ------------------------------------------------------------------ */

export interface Emoticon {
  name: string;
  file: string;
  codes: string[];
}

/** official YM shortcut list, canonical order (picker layout order) */
const RAW: [string, string, string[]][] = [
  ['happy', 'happy.gif', [':)', ':-)']],
  ['sad', 'sad.gif', [':(', ':-(']],
  ['winking', 'winking.gif', [';)', ';-)']],
  ['big grin', 'big-grin.gif', [':D', ':-D']],
  ['batting eyelashes', 'batting-eyelashes.gif', [';;)']],
  ['big hug', 'big-hug.gif', ['>:D<']],
  ['confused', 'confused.gif', [':-/', ':/']],
  ['love struck', 'love-struck.gif', [':x', ':X']],
  ['blushing', 'blushing.gif', [':">']],
  ['tongue', 'tongue.gif', [':P', ':p']],
  ['kiss', 'kiss.gif', [':-*', ':*']],
  ['broken heart', 'broken-heart.gif', ['=((']],
  ['surprise', 'surprise.gif', [':-O', ':O', ':-o']],
  ['angry', 'angry.gif', ['X(', 'x(']],
  ['smug', 'smug.gif', [':>', ':->']],
  ['cool', 'cool.gif', ['B-)', 'B)']],
  ['worried', 'worried.gif', [':-S', ':-s']],
  ['whew', 'whew.gif', ['#:-S']],
  ['devil', 'devil.gif', ['>:)']],
  ['crying', 'crying.gif', [':-((', ':((']],
  ['laughing', 'laughing.gif', [':))']],
  ['straight face', 'straight-face.gif', [':|', ':-|']],
  ['raised eyebrows', 'raised-eyebrows.gif', ['/:)']],
  ['rolling on the floor', 'rolling-on-the-floor.gif', ['=))']],
  ['angel', 'angel.gif', ['O:-)', 'O:)']],
  ['nerd', 'nerd.gif', [':-B', ':-b']],
  ['talk to the hand', 'talk-to-the-hand.gif', ['=;']],
  ['sleepy', 'sleepy.gif', ['I-)', '|-)']],
  ['rolling eyes', 'rolling-eyes.gif', ['8-|', '8|']],
  ['loser', 'loser.gif', ['L-)', 'L)']],
  ['sick', 'sick.gif', [':-&', ':&']],
  ["don't tell anyone", 'dont-tell-anyone.gif', [':-$', ':$']],
  ['no talking', 'no-talking.gif', ['[-(']],
  ['clown', 'clown.gif', [':O)', ':o)']],
  ['silly', 'silly.gif', ['8-}']],
  ['party', 'party.gif', ['<:-)']],
  ['yawn', 'yawn.gif', ['(:|']],
  ['drooling', 'drooling.gif', ['=P~']],
  ['thinking', 'thinking.gif', [':-?', ':-?']],
  ['applause', 'applause.gif', ['=D>']],
  ['nail biting', 'nail-biting.gif', [':-SS', ':SS']],
  ['hypnotized', 'hypnotized.gif', ['@-)']],
  ['liar', 'liar.gif', [':^o']],
  ['waiting', 'waiting.gif', [':-w', ':-W']],
  ['sigh', 'sigh.gif', [':-<']],
  ['phbbbbt', 'phbbbbt.gif', ['>:P']],
  ['cowboy', 'cowboy.gif', ['<):)']],
  ['pig', 'pig.gif', [':@)']],
  ['cow', 'cow.gif', ['3:-O']],
  ['monkey', 'monkey.gif', [':(|)']],
  ['chicken', 'chicken.gif', ['~:>']],
  ['rose', 'rose.gif', ['@};-', '@}--;-', '@};']],
  ['good luck', 'good-luck.gif', ['%%-']],
  ['flag', 'flag.gif', ['**==']],
  ['pumpkin', 'pumpkin.gif', ['(~~)']],
  ['coffee', 'coffee.gif', ['~O)']],
  ['idea', 'idea.gif', ['*-:)']],
  ['skull', 'skull.gif', ['8-X']],
  ['bug', 'bug.gif', ['=:)']],
  ['alien', 'alien.gif', ['>-)']],
  ['frustrated', 'frustrated.gif', [':-L']],
  ['praying', 'praying.gif', ['[-o<']],
  ['money eyes', 'money-eyes.gif', ['$-)']],
  ['whistling', 'whistling.gif', [':-"']],
  ['feeling beat up', 'feeling-beat-up.gif', ['b-(']],
  ['peace sign', 'peace-sign.gif', [':)>-']],
  ['shame on you', 'shame-on-you.gif', ['[-X']],
  ['dancing', 'dancing.gif', ['\\:D/']],
  ['bring it on', 'bring-it-on.gif', ['>:/', '>:D/']],
  ['hee hee', 'hee-hee.gif', [';))']],
  ['hiro', 'hiro.gif', ['o->']],
  ['billy', 'billy.gif', ['o=>']],
  ['april', 'april.gif', ['o-+']],
  ['chatterbox', 'chatterbox.gif', [':-<|']],
  ['not worthy', 'not-worthy.gif', ['^:)^']],
  ['oh go on', 'oh-go-on.gif', [':-j']],
  ['star', 'star.gif', ['(*)']],
  ['on the phone', 'on-the-phone.gif', [':)]']],
  ['call me', 'call-me.gif', [':-c']],
  ["at wits' end", 'at-wits-end.gif', ['~X(']],
  ['wave', 'wave.gif', [':h', ':->h']],
  ['time out', 'time-out.gif', [':t']],
  ['day dreaming', 'day-dreaming.gif', ['8->']],
  ["i don't know", 'i-dont-know.gif', [':??']],
  ['not listening', 'not-listening.gif', ['%(', '%(-(']],
  ['puppy dog eyes', 'puppy-dog-eyes.gif', [':o3']],
  ["i don't want to see", 'i-dont-want-to-see.gif', ['X_X']],
  ['hurry up!', 'hurry-up.gif', [':!!']],
  ['rock on!', 'rock-on.gif', ['\\m/']],
  ['thumbs down', 'thumbs-down.gif', [':q']],
  ['thumbs up', 'thumbs-up.gif', [':bd']],
  ["it wasn't me", 'it-wasnt-me.gif', ['^#(^']],
  ['bee', 'bee.gif', [':bz']],
  ['cheer', 'cheer.gif', ['~^o^~']],
  ['dizzy', 'dizzy.gif', ['@^@|||']],
  ['cook', 'cook.gif', ['[]']],
  ['eat', 'eat.gif', ['^o^||3']],
  ['give up', 'give-up.gif', [':(||>']],
  ['cold', 'cold.gif', ['+_+']],
  ['hot', 'hot.gif', [':::^^:::']],
  ['music', 'music.gif', ['o|^_^|o']],
  ['vomit', 'vomit.gif', [':puke!', ':puke']],
  ['sing', 'sing.gif', ['o|\\~']],
  ['catch', 'catch.gif', ['o|:)']],
  ['fight', 'fight.gif', [':(fight)']],
  ['down on luck', 'down-on-luck.gif', ['%*{']],
  ['unlucky', 'unlucky.gif', ['%||:{']],
  ['gift', 'gift.gif', ['&[]']],
  ['tv', 'tv.gif', [':(tv)']],
  ['studying', 'studying.gif', ['?@_@?']],
  ['spooky', 'spooky.gif', [':>~~']],
  ['search me', 'search-me.gif', ['@@']],
  ['game', 'game.gif', [':(game)']],
  ['high five', 'high-five.gif', [':)/\\:)']],
  ['exercise', 'exercise.gif', ['[]==[]']],
  ['pirate', 'pirate.gif', [':ar!']],
  ['transformer', 'transformer.gif', ['[..]']],
  ['yin yang', 'yin-yang.gif', ['(%)']],
  ['doh', 'doh.gif', ['#-o', '#o']],
];

export const EMOTICONS: Emoticon[] = RAW.map(([name, file, codes]) => ({ name, file, codes }));

export const EMOTICON_BASE = '/assets/emoticons';

/** codes sorted longest-first so greedy matching works (:)) before :)) etc.) */
const CODE_INDEX: { code: string; emo: Emoticon }[] = EMOTICONS.flatMap((e) =>
  e.codes.map((code) => ({ code, emo: e })),
).sort((a, b) => b.code.length - a.code.length);

/** Parse a message string into text + inline animated emoticon <img> nodes. */
export function renderEmoticons(text: string, size = 18): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let buf = '';
  let i = 0;
  let key = 0;
  const flush = () => {
    if (buf) {
      out.push(<React.Fragment key={`t${key++}`}>{buf}</React.Fragment>);
      buf = '';
    }
  };
  outer: while (i < text.length) {
    for (const { code, emo } of CODE_INDEX) {
      if (text.startsWith(code, i)) {
        // require word-ish boundary for short codes to avoid mid-word hits
        flush();
        out.push(
          <img
            key={`e${key++}`}
            src={`${EMOTICON_BASE}/${emo.file}`}
            alt={emo.name}
            title={`${emo.name} ${emo.codes[0]}`}
            style={{ height: size, width: 'auto', verticalAlign: '-3px', margin: '0 1px' }}
          />,
        );
        i += code.length;
        continue outer;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return out;
}

/** Find which emoticon (if any) a pure-code message is (for big-emoticon display) */
export function matchSingleEmoticon(text: string): Emoticon | null {
  const trimmed = text.trim();
  if (trimmed.length > 8) return null;
  for (const { code, emo } of CODE_INDEX) {
    if (trimmed === code || (trimmed.length === code.length + 1 && trimmed === code + ' ')) return emo;
  }
  return null;
}
