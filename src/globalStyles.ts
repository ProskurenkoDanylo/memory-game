import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: #080E15;
    color: #fff;
    font-family: 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Noto Sans', 'Montserrat', 'Poppins', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'PT Sans', system-ui, sans-serif;
  }

  button {
    font-family: 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Noto Sans', 'Montserrat', 'Poppins', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'PT Sans', system-ui, sans-serif;
    font-size: 1em;
  }
`;

export default GlobalStyle;
