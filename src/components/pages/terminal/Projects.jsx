import React from 'react'
import Footer from '../../Footer';
import CodeEditor from './component/CodeEditor'
//import '../../../App.css'
import { Box } from "@chakra-ui/react"
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme.js';

function Projects() {
    return (
    <div>
        <h1 className='Projects'>Questions</h1>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </div>
)
}

export default Projects;