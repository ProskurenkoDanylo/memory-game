import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Montserrat', 'Roboto', 'Lato', 'Source Sans Pro', 'Noto Sans', 'Montserrat', 'Poppins', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'PT Sans', system-ui, sans-serif;
    font-size: 1em;
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: #080E15;
    color: #fff;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 400;
    text-align: center;
  }

  h1 {
    font-size: clamp(2rem, 0.95rem + 0.25vw, 2.25rem);
  }

  h2 {
    font-size: clamp(1.75rem, 0.95rem + 0.25vw, 2rem);
  }

  h3 {
    font-size: clamp(1.5rem, 0.95rem + 0.25vw, 1.75rem);
  }

  h4 {
    font-size: clamp(1.25rem, 0.95rem + 0.25vw, 1.5rem);
  }

  h5, h6 {
    font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  }
`;

export default GlobalStyle;
