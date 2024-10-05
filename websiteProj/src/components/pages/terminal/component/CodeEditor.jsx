import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, PROBLEM } from "../constants";
import Output from "./Output";
import Question from "./Question";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("python");
    const [problem, setProblem] = useState("PaintingRoads");

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language])
    };

    const selectProblem = (problem) => {
        setProblem(problem);
    };
    

    return(
        <Box>
            <Question problem={problem}/>

            <HStack spacing={4}>
                <Box w='50%'>
                    <LanguageSelector language={language} onSelect={onSelect}/>
                    <Editor /* code editor box*/
 
                        height="75vh" 
                        language={language} 
                        theme="vs-dark"
                        defaultValue= {CODE_SNIPPETS[language]}
                        onMount={onMount}
                        value={value} onChange={(value) => setValue(value)}/>
                </Box>
                <Output editorRef={editorRef} language={language}/>
                
            </HStack>
        </Box>
    ); 
};
export default CodeEditor;