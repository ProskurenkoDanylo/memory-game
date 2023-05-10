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
`;

export default GlobalStyle;
