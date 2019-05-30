import { state, style, animate, transition, query, stagger } from '@angular/animations';

function fadeIn(selector = ':enter', duration = '400ms ease-out') {
  return [
    transition('* => *', [
      query(
        selector,
        [
          style({ opacity: 0, transform: 'translateY(-5px)' }),
          stagger('50ms', [
            animate(
              duration,
              style({
                opacity: 1,
                transform: 'translateY(0px)'
              })
            )
          ])
        ],
        { optional: true }
      )
    ])
  ];
}

function fadeOut(selector = ':leave', duration = '400ms ease-out') {
  return [
    transition('* => *', [
      query(
        selector,
        [
          style({
            opacity: 1,
            transform: 'translateY(0px)'
          }),
          stagger('50ms', [animate(duration, style({ opacity: 0, transform: 'translateY(-5px)' }))])
        ],
        { optional: true }
      )
    ])
  ];
}

export { fadeIn, fadeOut };
