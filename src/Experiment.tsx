/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ExperimentRunner,
  registerArrayExtensions,
  getParam,
  subsetExperimentByParam,
  canvasCountdown,
} from '@adriansteffan/reactive';

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

const SPLIT_WORD_PAIR_SURVEY = getParam(
  'split_wordpair_survey',
  true,
  'boolean',
  'Should the wordpair reflection pairs appear on separate pages?',
);

const WORDPAIR_SURVEY_LENGTH = getParam(
  'wordpair_survey_len',
  3,
  'number',
  'How many reflection questions are asked at the end to test the intervention',
);

const DP_LENGTH_PRACTICE = getParam(
  'number_dp_practice',
  10,
  'number',
  'How many dotprobe trials to practice with',
);
const DP_LENGTH_TEST = getParam(
  'number_dp_test',
  240,
  'number',
  'How many dotprobe trials to show',
);

const offsetScreencenterDP = 0.2;
const canvasFontSizeRatio = 0.025;
const dotScale = 0.007;

const wordPairsDP = [
  ['Inept', 'Basic'],
  ['Foolish', 'Typical'],
  ['Expelled', 'Moderate'],
  ['Inadequate', 'Acceptable'],
  ['Blunder', 'Average'],
  ['Careless', 'Function'],
  ['Silly', 'Usual'],
  ['Unsuccessful', 'Information'],
  ['Negligent', 'Rectangle'],
  ['Exmination', 'Television'],
  ['Stupidity', 'Notebook'],
  ['Ignorant', 'Backpack'],
  ['Incompetent', 'Refrigerator'],
  ['Mistake', 'Drawers'],
  ['Disgraced', 'Container'],
  ['Idiotic', 'Tolerable'],
  ['Failure', 'Library'],
  ['Ashamed', 'Pendant'],
  ['Inferior', 'Patience'],
  ['Unprepared', 'Calculator'],
  ['Test', 'Tree'],
  ['Unwell', 'Candle'],
  ['Lonely', 'Bucket'],
  ['Injury', 'Button'],
  ['Violence', 'Mushroom'],
  ['Coffin', 'Rocket'],
  ['Rejected', 'Elevator'],
  ['Danger', 'Breeze'],
  ['Infectious', 'Campground'],
  ['Assault', 'Journey'],
  ['Hateful', 'Charger'],
  ['Harmful', 'Picture'],
  ['Disease', 'Luggage'],
  ['Illness', 'Biscuit'],
  ['Painful', 'Factory'],
  ['Lethal', 'Peanut'],
  ['Ignored', 'Horizon'],
  ['Hazard', 'Teapot'],
  ['Aggressive', 'Motorcycle'],
  ['Alarming', 'Building'],
  ['Anger', 'Chair'],
  ['Anxiety', 'Package'],
  ['Brutal', 'Window'],
  ['Bully', 'Plant'],
  ['Burning', 'Pattern'],
  ['Arsen', 'Table'],
  ['Chaos', 'Stone'],
  ['Fight', 'Clock'],
  ['Confrontation', 'Entertainment'],
  ['Corrupt', 'Already'],
  ['Creepy', 'Leaves'],
  ['Criminal', 'Interest'],
  ['Cruel', 'Plate'],
  ['Criticism', 'Afternoon'],
  ['Critical', 'Remember'],
  ['Cutthroat', 'Discovery'],
  ['Damage', 'Should'],
  ['Death', 'Horse'],
  ['Deadly', 'Differ'],
  ['Depressing', 'Strawberry'],
  ['Depraved', 'Probably'],
  ['Desperate', 'Therefore'],
  ['Destabilize', 'Application'],
  ['Destruction', 'Educational'],
  ['Dictator', 'Category'],
  ['Disgusting', 'Department'],
  ['Stressful', 'Household'],
  ['Distressing', 'Perspective'],
  ['Disturbing', 'Newsletter'],
  ['Doom', 'Screw'],
  ['Dread', 'Float'],
  ['Emergency', 'Propeller'],
  ['Pandemic', 'Hardware'],
  ['Fascism', 'Cabinet'],
  ['Fatal', 'Middle'],
  ['Afraid', 'Figure'],
  ['Fearful', 'Chicken'],
  ['Felon', 'Toast'],
  ['Hell', 'Hair'],
  ['Hopeless', 'Practice'],
  ['Horror', 'Potato'],
  ['Hostile', 'Another'],
  ['Hurtful', 'Gallery'],
  ['Hysteria', 'Official'],
  ['Ill', 'Egg'],
  ['Threat', 'Planet'],
  ['Madness', 'Butter'],
  ['Insanity', 'Producer'],
  ['Maniac', 'Bubble'],
  ['Misery', 'Spring'],
  ['Murderer', 'Ordinary'],
  ['Offense', 'Evening'],
  ['Panic', 'Whisk'],
  ['Paranoia', 'Material'],
  ['Poison', 'Letter'],
  ['Predator', 'Optional'],
  ['Problem', 'Because'],
  ['Punish', 'Winter'],
  ['Radical', 'Formula'],
  ['Rage', 'Then'],
  ['Risk', 'Fact'],
  ['Ruin', 'Ball'],
  ['Ruthless', 'Maintain'],
  ['Sickness', 'Normally'],
  ['Scary', 'Years'],
  ['Spiteful', 'Portrait'],
  ['Terrifying', 'Signature'],
  ['Terror', 'Cheese'],
  ['Terrorist', 'Landscape'],
  ['Toxic', 'Until'],
  ['Unsafe', 'Sailor'],
  ['Turbulent', 'Guideline'],
  ['Upsetting', 'Breakfast'],
  ['Unstable', 'Variable'],
  ['Vile', 'Fact'],
  ['War', 'Car'],
  ['Weapon', 'Pepper'],
  ['Grief', 'Grass'],
  ['Killer', 'Tomato'],
  ['Ugly', 'Clip'],
  ['Military', 'Computer'],
  ['Evil', 'Slack'],
  ['Grim', 'Wave'],
  ['Satanic', 'Gesture'],
  ['Grave', 'Water'],
  ['Lifeless', 'Outside'],
  ['Loss', 'Tide'],
  ['Sinister', 'Register'],
  ['Serious', 'Fashion'],
  ['Blood', 'Towel'],
  ['Menace', 'Pencil'],
  ['Conflict', 'Activity'],
  ['Disaster', 'Workshop'],
  ['Catastrophic', 'Alternatives'],
  ['Bomb', 'Case'],
  ['Collapse', 'Indirect'],
  ['Nightmare 	Chocolate'],
  ['Cheater', 'Earlobe'],
  ['Betrayal', 'Saturday'],
  ['Envy', 'Bean'],
  ['Greed', 'White'],
  ['Stalker', 'Flowers'],
  ['Torture', 'Jogging'],
  ['Uncertain', 'Dishtowel'],
  ['Canibal', 'Bicycle'],
];

const interventionGroup = true;
registerArrayExtensions();

function initCanvas(ctx, w, h) {
  ctx.font = `${Math.min(w, h) * canvasFontSizeRatio}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

function createDPTimeline(n: number) {
  const adjustedN = n % 2 === 0 ? n : n + 1;
  const threatPercentage = interventionGroup ? 0.1 : 0.5;

  const upperArray = Array.from({ length: adjustedN }, (_, i) => i < adjustedN / 2).shuffle();
  const threatArray = Array.from(
    { length: adjustedN },
    (_, i) => i < Math.round(adjustedN * threatPercentage),
  ).shuffle();

  return [
    ...wordPairsDP
      .pipe((arr) => {
        if (adjustedN % arr.length === 0) {
          console.log(
            'Number of DP trials is a divisible by wordpair list length, using provided list as is',
          );
          return Array.from({ length: adjustedN / arr.length }, (_) => arr.shuffle()).flat();
        }
        console.log(
          `Number of DP ${adjustedN} trials NOT as long as word list ${arr.length}, sampling`,
        );
        return arr.sample(adjustedN);
      })
      .map((v, index) => ({
        words: v,
        upper: upperArray[index],
      }))
      .map((v, index) => {
        return {
          ...v,
          threatDot: threatArray[index],
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
              {i === 0 && (
                <>
                  <h1>Task B: Get ready</h1>
                  Get ready for Task B. Remember, in this task you will have to indicate the
                  position of a dot that appears after a word pair. <br />
                </>
              )}
              {i !== 0 && (
                <>
                  <h1>
                    Task B: You have completed {i}/{nblocks} blocks
                  </h1>
                  Feel free to take a short break before starting the next block. Continue the trial
                  once you feel ready <br />
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
          Welcome to our study! Here is a brief rundown of what you can expect:
          <br /> First you will be asked to give your consent to participate in this study. After
          that the actual experiment starts, in which you will be repeatedly asked to indicate a
          position of a dot following two presented words. Afterwards, we will ask you a few
          questions about your experience during the task.
          <br />
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
          Thank you for your interest in our research project. Enclosed you will find information
          about the research project, the conditions of participation and the handling of the
          collected data. Please read everything carefully. If you agree and want to participate in
          the experiment, please confirm by giving your consent below.
          <br />
          <h4>General information about the research project:</h4> <br />
          This study investigates how people make decisions in a multi-attribute situation. The
          study takes about 15 minutes in total (if no longer breaks are taken) and includes a short
          anxiety-related questionnaire and tasks in which you are asked to react to words presented
          on the screen with pressing the corresponding keys on the keyboard. No special stress or
          harm is expected as a result of participating in this research project. Participation in
          the study is remunerated at the rate displayed in Prolific, rounded up to the nearest
          minute.
          <br />
          <h4>Voluntary participation:</h4>
          Your participation in this research project is voluntary. You can withdraw your consent to
          participate at any time and without giving reasons, without receiving any disadvantages.
          Even if you decide to withdraw from the study, you are still entitled to receive the
          corresponding remuneration for the time spent up to that point, provided that this can be
          clearly demonstrated.
          <br />
          <h4>Participation requirements:</h4>
          The only participation requirement is a minimum age of 18 years. Those who have already
          participated in this study are excluded from participation.
          <br />
          <h4>Data protection and anonymity:</h4>
          Apart from gender, age and the sum scores of the anxiety questionnaire, no personal data
          are collected as part of this study. It is therefore not possible for us to personally
          identify you. As a user of Prolific, you have entered into a separate personal data
          processing agreement with Prolific. This agreement is independent of your consent related
          to this study and the personal data collected by Prolific will not be made available to
          the research team of this study at any point.
          <br />
          <h4>Use of data:</h4>
          The results of this study may be published for teaching and research purposes (e.g.
          theses, scientific publications or conference papers). These results will be presented in
          anonymized form, i.e. without the data being able to be connected to a specific person.
          The fully anonymized data of this study will be made available as "open data" in an
          internet-based repository, if applicable. Thus, this study follows the recommendations of
          the German Research Foundation (DFG) for quality assurance with regard to verifiability
          and reproducibility of scientific results, as well as optimal data re-use. If you would
          like to receive information on the scientific results of the study after its completion,
          please send an e-mail to Vianne Demirel (vianne.demirel@campus.lmu.de).
          <br />
          <h4>Legal basis and revocation:</h4>
          The legal basis for processing the aforementioned personal data is the consent pursuant to
          Art. 6 (1) letter a EU-DSGVO at the end of this document. You have the right to revoke the
          data protection consent at any time. The revocation does not affect the lawfulness of the
          processing carried out on the basis of the consent until the revocation. You can request
          an obligatory deletion of your data at any time - as long as you can provide sufficient
          information that allows us to identify your data. To do so, please contact the research
          project managers. You will not suffer any disadvantages as a result of the revocation.
          Research project managers: If you have any questions about the research project or if you
          want to exercise your right to withdraw your consent, please contact the research project
          managers:
          <br />
          <br />
          Vianne Demirel
          <br />
          Prof. Dr. Christopher Donkin
          <br />
          <br />
          Ludwig-Maximilians-Universität München
          <br />
          Department Psychologie
          <br />
          Lehrstuhl für Computational Modeling in Psychology
          <br />
          Akademiestr. 7<br />
          80799 München
          <br />
          <br />
          vianne.demirel@campus.lmu.de <br />
          c.donkin@psy.lmu.de
          <br />
          <br />
          Further contact addresses:
          <br />
          You can also contact the data protection officer of the research institution or the
          competent supervisory authority if you have any data protection concerns in connection
          with this study and/or wish to lodge a complaint.
          <br />
          <br />
          Ludwig-Maximilians-Universität <br />
          München Behördlicher Datenschutzbeauftragter
          <br />
          Geschwister-Scholl-Platz 1 <br />
          D-80539 München <br /> Bayerisches Landesamt für Datenschutzaufsicht
          <br />
          Promenade 27 <br />
          91522 Ansbach
          <br />
          <br />
          <br />
          <strong>Date: April 15, 2025</strong>
          <br />
          <br />
          Declaration of consent. I hereby certify that I have read and understood the participant
          information described above and that I agree to the conditions stated. I agree in
          accordance with Art. 6 (1) letter a EU-DSGVO. I have been informed about my right to
          revoke my data protection consent.
          <br />
          Declaration of fulfillment inclusion criteria. I hereby confirm that I meet the above
          conditions for participation (18+ years old, first-time participation).
        </>
      ),
    },
  },
  { type: 'EnterFullscreen' },
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: KEYS_DP,
      content: (
        <>
          <h1>Practice Round</h1>
          In our task you are presented with a pair of words. One of the words will appear above the
          fixation cross and one will appear below. After a short time the words will disappear and
          a dot will appear in the place of one of the words previously shown. You must indicate if
          the dot appeared below of above the fixation cross. If it appears below the fixation
          cross, press the key{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_DP[1].toUpperCase()}
          </kbd>
          . If the dot appears above the fixation cross, press the key{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_DP[0].toUpperCase()}
          </kbd>
          . There will be two blocks that will each take around five minutes to complete + a short
          practice block in the beginning. Feel free to take short breaks in between the blocks.{' '}
          <br />{' '}
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
  ...createMegablockDP(DP_LENGTH_TEST, 2),
  {
    name: 'TaskAwareness',
    type: 'Quest',
    props: {
      surveyJson: {
        title: 'Noticed anything?',
        showQuestionNumbers: false,
        pages: [
          {
            elements: [
              {
                type: 'comment',
                name: 'task_awareness',
                title:
                  'Did you notice anything about the task that informed how you approach the task?',
                isRequired: true,
                placeholder: 'Please share your observations...',
              },
            ],
          },
        ],
        completeText: 'Submit',
        showPrevButton: false,
      },
    },
  },
  ...(SPLIT_WORD_PAIR_SURVEY
    ? [
        {
          name: `WordReplacement`,
          type: 'Quest',
          metadata: {bla: "hello"},
          props: {
            surveyJson: {
              title: 'A few more questions',
              showQuestionNumbers: false,
              pages: wordPairsDP
                .shuffle()
                .slice(0, WORDPAIR_SURVEY_LENGTH)
                .map((pair, i) => ({
                  elements: [
                    {
                      type: 'radiogroup',
                      name: `word_pair_${i}`,
                      title: 'Which word will most likely be replaced by the dot?',
                      isRequired: true,
                      choices: [
                        { value: `threat_${pair[0]}_alternative_${pair[1]}`, text: pair[0] },
                        { value: `neutral_${pair[1]}_alternative_${pair[0]}`, text: pair[1] },
                      ].shuffle(),
                    },
                  ],
                })),
              completeText: 'Submit',
              showPrevButton: false,
            },
          },
        },
      ]
    : [
        {
          name: 'WordReplacement',
          type: 'Quest',
          props: {
            surveyJson: {
              title: 'A few more questions',
              showQuestionNumbers: false,
              pages: [
                {
                  elements: wordPairsDP
                    .shuffle()
                    .slice(0, WORDPAIR_SURVEY_LENGTH)
                    .map((pair, i) => ({
                      type: 'radiogroup',
                      name: `word_pair_${i}`,
                      title: 'Which word will most likely be replaced by the dot?',
                      isRequired: true,
                      choices: [
                        { value: `threat_${pair[0]}_alternative_${pair[1]}`, text: pair[0] },
                        { value: `neutral_${pair[1]}_alternative_${pair[0]}`, text: pair[1] },
                      ].shuffle(),
                    })),
                },
              ],
              completeText: 'Submit',
              showPrevButton: false,
            },
          },
        },
      ]),
  { type: 'ExitFullscreen' },
  {
    type: 'Upload',
    props: {
      sessionCSVBuilder: {
        filename: '',
        trials: ['CheckDevice', 'TaskAwareness', 'WordReplacement'],
        fun: (sessionInfo: Record<string, any>) => {
          sessionInfo['interventionGroup'] = interventionGroup;

          return sessionInfo;
        },
      },
      trialCSVBuilders: [
        {
          filename: `_DP__${Date.now()}`,
          trials: ['DotProbeTaskPractice', 'DotProbeTask_Block_1', 'DotProbeTask_Block_2'],
        },
      ],
    },
  },
  {
    type: 'ProlificEnding',
    hideSettings: true,
    props: { prolificCode: import.meta.env.VITE_PROLIFIC_CODE },
  },
]);

export default function Experiment() {
  return <ExperimentRunner timeline={experiment} />;
}
