import { css, keyframes } from 'styled-components'

const fadeInKeyframes = keyframes`
    from {
        filter: blur(5px);
        opacity: 0;
    }
    to {
        filter: blur(0);
        opacity: 1;
    }
`

const placeHolderShimmer = keyframes`
    0%{
        background-position: -490px 0
    }
    100%{
        background-position: 490px 0
    }
`
const bounceDownKeyFrames = pos =>
  keyframes`
 0% {
 top: ${pos - 50}px;
  }

  25% {
    top: ${pos + 5}px;
  }

  40%{
    top: ${pos - 10}px
  }

  65%{
    top: ${pos + 3}px
  }

  100% {
    top: ${pos}px;
  }
`

export const fadeIn = ({ time = '1s', type = 'ease' } = {}) => css`
  animation: ${time} ${fadeInKeyframes} ${type};
`

export const bounceDown = ({ time = '1s', type = 'ease', pos = '0' } = {}) =>
  css`
    animation: ${time} ${bounceDownKeyFrames(pos)} ${type};
  `

export const skeletonAnimation = ({
  time = '2s',
  fill = 'forwards',
  iteration = 'infinite',
  timingFunction = 'linear',
  colorBackground = '#f6f7f8',
  colorAnimation = '#edeef1'
} = {}) =>
  css`
    animation-duration: ${time};
    animation-fill-mode: ${fill};
    animation-iteration-count: ${iteration};
    animation-name: ${placeHolderShimmer};
    animation-timing-function: ${timingFunction};
    background-image: -webkit-gradient(
      linear,
      left center,
      right center,
      from(${colorBackground}),
      color-stop(0.2, ${colorAnimation}),
      color-stop(0.4, ${colorAnimation}),
      to(${colorBackground})
    );
    background-image: -webkit-linear-gradient(
      left,
      ${colorBackground} 0%,
      ${colorAnimation} 50%,
      ${colorBackground} 80%,
      ${colorBackground} 100%
    );
    position: relative;
  `
