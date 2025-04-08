/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ExperimentRunner,
  registerArrayExtensions,
  getParam,
  subsetExperimentByParam,
  canvasCountdown,
} from '@adriansteffan/reactive';

const KEY_WORD = getParam(
  'key_ld_word',
  'm',
  'string',
  'what key to use when indicating "word" in LD task',
);
const KEY_NON_WORD = getParam(
  'key_ld_non_word',
  'x',
  'string',
  'what key to use when indicating "non word" in LD task',
);
const KEYS_LD = [KEY_WORD, KEY_NON_WORD];

const KEY_UPPER = getParam(
  'key_dp_above',
  'u',
  'string',
  'what key to use when indicating "dot above +" in DP task',
);
const KEY_LOWER = getParam(
  'key_dp_under',
  'j',
  'string',
  'what key to use when indicating "dot under +" in DP task',
);
const KEYS_DP = [KEY_UPPER, KEY_LOWER];

const LD_LENGTH_PRACTICE = getParam(
  'number_ld_practice',
  20,
  'number',
  'How many lexical decision trials to practice with',
);
const LD_LENGTH_TEST = getParam(
  'number_ld_test',
  540,
  'number',
  'How many lexical decision trials to show in each block',
);

const DP_LENGTH_PRACTICE = getParam(
  'number_dp_practice',
  20,
  'number',
  'How many dotprobe trials to practice with',
);
const DP_LENGTH_TEST = getParam(
  'number_dp_test',
  580,
  'number',
  'How many dotprobe trials to show',
);

const offsetScreencenterDP = 0.2;
const canvasFontSizeRatio = 0.025;
const dotScale = 0.007;

const wordListsLD = {
  threat: {
    proportion: getParam(
      'ld_proportion_threat',
      0.25,
      'number',
      'How many lexical decision trials should be threats',
    ),
    list: ['bad', 'really bad', 'even worse'],
  },
  neutral: {
    proportion: getParam(
      'ld_proportion_neutral',
      0.25,
      'number',
      'How many lexical decision trials should be neutral',
    ),
    list: ['neutral', 'really neutral', 'really really neutral'],
  },
  nonword: {
    proportion: getParam(
      'ld_proportion_nonword',
      0.5,
      'number',
      'How many lexical decision trials should be non-words',
    ),
    list: ['sadfa', 'hjkghk', 'tcve'],
  },
};

const wordPairsDP = [
  ['neutral1', 'threat1'],
  ['neutral2', 'threat2'],
  ['neutral3', 'threat3'],
  ['neutral4', 'threat4'],
  ['neutral5', 'threat5'],
  ['neutral6', 'threat6'],
  ['neutral7', 'threat7'],
  ['neutral8', 'threat8'],
  ['neutral9', 'threat9'],
  ['neutral10', 'threat10'],
  ['neutral11', 'threat11'],
  ['neutral12', 'threat12'],
];

const interventionGroup = Math.random() < 0.5;
registerArrayExtensions();

function initCanvas(ctx, w, h) {
  ctx.font = `${Math.min(w, h) * canvasFontSizeRatio}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

function createLDTimeline(n: number) {
  return [
    ...Object.entries(wordListsLD)
      .map(([type, val]) =>
        val.list
          .pipe((arr) => {
            if (arr.length === Math.round(val.proportion * n)) {
              console.log(
                'Number of LD trials as long as trial portion, using provided list as is',
              );
              return arr.shuffle();
            }
            console.log('Number of LD trials as NOT long as trial portion, sampling');
            return arr.sample(Math.round(val.proportion * n));
          })
          .map((word) => ({
            word,
            type,
            correctKey: type === 'nonword' ? KEY_NON_WORD : KEY_WORD,
          })),
      )
      .flat()
      .shuffle()
      .map((wordObj: any) => [
        {
          draw: (ctx, w, h) => {
            ctx.fillStyle = 'black';
            ctx.fillText(wordObj.word, w / 2, h / 2);
          },
          allowedKeys: KEYS_LD,
          metadata: wordObj,
        },
        (data: any[]) => {
          return {
            draw: (ctx, w, h) => {
              if (data[data.length - 1].key !== wordObj.correctKey) {
                ctx.fillStyle = 'RED';
                ctx.fillText('Error', w / 2, h / 2);
              } else {
                ctx.fillText('+', w / 2, h / 2);
              }
            },
            displayDuration: 500,
            ignoreData: true,
          };
        },
      ])
      .flat(),
  ];
}

function createDPTimeline(n: number) {
  const adjustedN = n % 2 === 0 ? n : n + 1;
  const threatPercentage = interventionGroup ? 0.1 : 0.5;
  const threatCount = Math.round(adjustedN * threatPercentage);

  return [
    ...wordPairsDP
      .pipe((arr) => {
        if (arr.length === adjustedN) {
          console.log('Number of DP trials as long as wordpair list, using provided list as is');
          return arr.shuffle();
        }
        console.log('Number of DP trials NOT as long as word list, sampling');
        return arr.sample(adjustedN);
      })
      .map((v, index) => ({
        words: v,
        upper: index < adjustedN / 2,
      }))
      .shuffle()
      .map((v, index) => {
        return {
          ...v,
          threatDot: index < threatCount,
        };
      })
      .map((v) => ({
        correctKey: v.upper ? KEY_UPPER : KEY_LOWER,
        upperDot: v.upper,
        threatDot: v.threatDot,
        upperWord: (v.upper && v.threatDot) || (!v.upper && !v.threatDot) ? v.words[0] : v.words[1],
        lowerWord: (v.upper && v.threatDot) || (!v.upper && !v.threatDot) ? v.words[1] : v.words[0],
        interventionGroup: interventionGroup,
      }))
      .shuffle()
      .map((dpObj: any) => [
        {
          draw: (ctx, w, h) => {
            ctx.fillText('+', w / 2, h / 2);
          },
          displayDuration: 500,
          ignoreData: true,
        },
        {
          draw: (ctx, w, h) => {
            ctx.fillText(dpObj.upperWord, w / 2, h / 2 - (h / 2) * offsetScreencenterDP);
            ctx.fillText(dpObj.lowerWord, w / 2, h / 2 + (h / 2) * offsetScreencenterDP);
            ctx.fillText('+', w / 2, h / 2);
          },
          displayDuration: 500,
          ignoreData: true,
        },
        {
          draw: (ctx, w, h) => {
            ctx.fillText('+', w / 2, h / 2);

            const dotSize = w * dotScale;

            ctx.beginPath();
            ctx.arc(
              w / 2,
              h / 2 + (h / 2) * offsetScreencenterDP * (dpObj.upperDot ? -1 : 1),
              dotSize / 2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          },
          allowedKeys: KEYS_DP,
          displayDuration: 3000,
          responseTimelimit: 3000,
          metadata: dpObj,
        },
        (data: any[]) => {
          return {
            draw: (ctx, w, h) => {
              if (data[data.length - 1].key !== dpObj.correctKey) {
                ctx.fillStyle = 'RED';
                ctx.fillText('Error', w / 2, h / 2);
              } else {
                ctx.fillText('+', w / 2, h / 2);
              }
            },
            displayDuration: 500,
            ignoreData: true,
          };
        },
      ])
      .flat(),
  ];
}

function keyInstructions(keys: string[], upperText: string, lowerText: string) {
  return (
    <>
      <br />
      Please place your fingers on these keys:{' '}
      <div className='space-y-4 mt-5 mb-5'>
        <div className='flex items-center space-x-2'>
          <kbd className='px-3 py-2 mr-4 text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {keys[0].toUpperCase()}
          </kbd>{' '}
          Press {keys[0]} {upperText}
        </div>
        <div className='flex items-center space-x-2'>
          <kbd className='px-3 py-2 mr-4 text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {keys[1].toUpperCase()}
          </kbd>{' '}
          Press {keys[1]} {lowerText}
        </div>
      </div>
      Press any of the keys to start the task.
    </>
  );
}

function createMegablockDP(ntrials: number, nblocks: number) {
  return createDPTimeline(ntrials)
    .chunk(nblocks)
    .map((x) => [...canvasCountdown(3), ...x])
    .map((timelineChunk, i) => [
      {
        type: 'Text',
        props: {
          buttonText: null,
          allowedKeys: KEYS_DP,
          content: (
            <>
              <h1>
                Get ready for Block {i + 1}/{nblocks}
              </h1>
              {i === 0 && (
                <>
                  Let's start the actual round. Remember, in this task you will have to indicate the
                  position of a dot that appears after a word pair. <br />
                </>
              )}
              {i !== 0 && (
                <>
                  {' '}
                  You can now take a quick break. Continue the trial once you feel ready <br />
                </>
              )}{' '}
              {keyInstructions(
                KEYS_DP,
                'if the dot appears above the +.',
                'if the dot appears below the +.',
              )}
            </>
          ),
        },
      },
      {
        name: `DotProbeTask_Block_${i + 1}`,
        type: 'CanvasBlock',
        props: {
          timeline: timelineChunk,
          initCanvas,
        },
      },
    ])
    .flat();
}

function createMegablockLD(index: number, ntrials: number, nblocks: number) {
  return createLDTimeline(ntrials)
    .chunk(nblocks)
    .map((x) => [...canvasCountdown(3), ...x])
    .map((timelineChunk, i) => [
      {
        type: 'Text',
        props: {
          buttonText: null,
          allowedKeys: KEYS_LD,
          content: (
            <>
              <h1>
                Get ready for Block {i + 1}/{nblocks}
              </h1>
              {i === 0 && (
                <>
                  Let's get into the real task. Just like before, you will have to decide if the
                  string you see is a word or not and press a key in response. <br />
                </>
              )}
              {i !== 0 && (
                <>
                  {' '}
                  You can now take a quick break. Continue the trial once you feel ready <br />
                </>
              )}{' '}
              {keyInstructions(
                KEYS_LD,
                'if the string you see is a word.',
                'if the string you see is a non-word.',
              )}
            </>
          ),
        },
      },
      {
        name: `LexicalDecicionTask${index}_Block_${i + 1}`,
        type: 'CanvasBlock',
        props: {
          timeline: timelineChunk,
          initCanvas,
        },
      },
    ])
    .flat();
}

const experiment = subsetExperimentByParam([
  {
    name: 'CheckDevice',
    type: 'CheckDevice',
    props: {
      check: (deviceInfo) => {
        return !deviceInfo.isMobile;
      },
    },
  },
  {
    name: 'IntroText',
    type: 'Text',
    collectRefreshRate: true,
    props: {
      buttonText: "Let's Begin",
      animate: true,
      content: (
        <>
          <h1> Welcome to our Study </h1>
          Welcome to our study bla bla Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
          aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu <br />
        </>
      ),
    },
  },
  {
    name: 'ConsentText',
    type: 'Text',
    props: {
      buttonText: 'Accept',
      animate: true,
      content: (
        <>
          <h1> Participant Information </h1>
          Informed consent bla bla Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu <br />
        </>
      ),
    },
  },
  {
    name: 'Anxiety Survey',
    type: 'Quest',
    props: {
      surveyJson: {
        title: 'A few questions before we start',
        description:
          'A number of statements which people have used to describe themselves are given below. Read each statement and then select the number at the end of the statement that indicates HOW YOU GENERALLY FEEL. There are no right or wrong answers. Do not spend too much time on any one statement but give the answer which seems to describe how you generally feel. Thank you.',
        showQuestionNumbers: false,
        pages: [
          {
            elements: [
              {
                name: 'anx_item1',
                title: 'I feel that difficulties are piling up so I cannot overcome them.',
              },
              {
                name: 'anx_item2',
                title: "I worry too much over something that really doesn't matter.",
              },
              {
                name: 'anx_item3',
                title: 'Some unimportant thoughts run through my mind and it bothers me.',
              },
              {
                name: 'anx_item4',
                title: "I take disappointments so keenly that I can't put them out of my mind.",
              },
              {
                name: 'anx_item5',
                title:
                  'I get in a state of tension or turmoil as I think over my recent concerns and interests.',
              },
            ].map((x) => ({
              type: 'rating',
              name: x.name,
              title: x.title,
              isRequired: true,
              rateMin: 1,
              rateMax: 4,
              minRateDescription: 'Not at all',
              maxRateDescription: 'Very much so',
            })),
          },
        ],
        completeText: 'Submit',
        showPrevButton: false,
      },
    },
  },
  { type: 'EnterFullscreen' },
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: KEYS_LD,
      content: (
        <>
          <h1>Get ready</h1>
          Let's practice the first task. You will have to decide if the string you see is a word or
          not and press a key in response. <br />{' '}
          {keyInstructions(
            KEYS_LD,
            'if the string you see is a word.',
            'if the string you see is a non-word.',
          )}
        </>
      ),
    },
  },
  {
    name: 'LexicalDecicionTaskPractice',
    type: 'CanvasBlock',
    props: {
      timeline: [...canvasCountdown(3), ...createLDTimeline(LD_LENGTH_PRACTICE)],
      initCanvas,
    },
  },
  ...createMegablockLD(1, LD_LENGTH_TEST, 2),
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: KEYS_DP,
      content: (
        <>
          <h1>Get ready</h1>
          Let's practice the second task. In this task you will have to indicate the position of a
          dot that appears after a word pair. <br />{' '}
          {keyInstructions(
            KEYS_DP,
            'if the dot appears above the +.',
            'if the dot appears below the +.',
          )}
        </>
      ),
    },
  },
  {
    name: 'DotProbeTaskPractice',
    type: 'CanvasBlock',
    props: {
      timeline: [...canvasCountdown(3), ...createDPTimeline(DP_LENGTH_PRACTICE)],
      initCanvas,
    },
  },
  ...createMegablockDP(DP_LENGTH_TEST, 4),
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: true,
      content: (
        <>
          <h1>One more task</h1>
          For our last task, we will go back to the first task. Just like before, you will have to
          decide if the string you see is a word or not and press a key in response. <br /> Press
          any key to continue.
        </>
      ),
    },
  },
  ...createMegablockLD(2, LD_LENGTH_TEST, 2),
  { type: 'ExitFullscreen' },
  {
    type: 'Upload',
    props: {
      sessionCSVBuilder: {
        filename: '',
        trials: ['Anxiety Survey', 'CheckDevice'],
        fun: (sessionInfo: Record<string, any>) => {
          sessionInfo['interventionGroup'] = interventionGroup;
          sessionInfo['sum_anxiety'] =
            sessionInfo.anx_item1 +
            sessionInfo.anx_item2 +
            sessionInfo.anx_item3 +
            sessionInfo.anx_item4 +
            sessionInfo.anx_item5;

          return sessionInfo;
        },
      },
      trialCSVBuilders: [
        {
          filename: `_DP__${Date.now()}`,
          trials: [
            'DotProbeTaskPractice',
            'DotProbeTask_Block_1',
            'DotProbeTask_Block_2',
            'DotProbeTask_Block_3',
            'DotProbeTask_Block_4',
          ],
        },
        {
          filename: `_LD__${Date.now()}`,
          trials: [
            'LexicalDecicionTaskPractice',
            'LexicalDecicionTask1_Block_1',
            'LexicalDecicionTask1_Block_2',
            'LexicalDecicionTask2_Block_1',
            'LexicalDecicionTask2_Block_2',
          ],
        },
      ],
    },
  },
  { type: 'ProlificEnding', hideSettings: true, props: { prolificCode: 'YOUR_CODE_HERE' } },
]);

export default function Experiment() {
  return <ExperimentRunner timeline={experiment} />;
}
