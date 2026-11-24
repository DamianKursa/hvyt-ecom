import React from 'react';

/** Trzy kropki zapalane po kolei; cykl zapętla się. */
const PriceLoader: React.FC = () => (
  <span className="price-loader" aria-hidden="true">
    <span />
    <span />
    <span />
    <style jsx>{`
      .price-loader {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        min-height: 1em;
        color: inherit;
      }

      .price-loader span {
        width: 6px;
        height: 6px;
        border-radius: 9999px;
        background: currentColor;
        opacity: 0.25;
      }

      .price-loader span:nth-child(1) {
        animation: price-dot-1 1.4s infinite;
      }

      .price-loader span:nth-child(2) {
        animation: price-dot-2 1.4s infinite;
      }

      .price-loader span:nth-child(3) {
        animation: price-dot-3 1.4s infinite;
      }

      @keyframes price-dot-1 {
        0%,
        12% {
          opacity: 0.25;
        }
        22%,
        78% {
          opacity: 1;
        }
        90%,
        100% {
          opacity: 0.25;
        }
      }

      @keyframes price-dot-2 {
        0%,
        32% {
          opacity: 0.25;
        }
        42%,
        78% {
          opacity: 1;
        }
        90%,
        100% {
          opacity: 0.25;
        }
      }

      @keyframes price-dot-3 {
        0%,
        52% {
          opacity: 0.25;
        }
        62%,
        78% {
          opacity: 1;
        }
        90%,
        100% {
          opacity: 0.25;
        }
      }
    `}</style>
  </span>
);

export default PriceLoader;
