import { Box, Button, Text, useToast } from "@chakra-ui/react"
import { ANSWERS } from "../constants";
import { executeCode } from "../api";
import { useState } from "react";


const Output = ({editorRef, language}) => {
    const toast = useToast();
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isCorrect, setCorrect] = useState(false);
    const [answer, setAnswer] = useState("100");
    const [correctChecker, setcorrectChecker] = useState(null);

    
    const correctSetter = (correct) => {
        setCorrect(correct)
    }

    const answerSetter = () => {
        setAnswer(answer)
    }

    const runCode = async () => {
        answerSetter();
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try{
            setIsLoading(true)
            const {run:result} = await executeCode(language, sourceCode)
            setOutput(result.output);
            
            if (result.output == answer) {
                correctSetter(true);
                setcorrectChecker(true);
            }
            result.stderr ? setIsError(true) : setIsError(false)
        
        }
        catch (error) {
            console.log(error);
            toast({
                title: "An error occured.",
                description: error.message || "Unable to run code",
                status: "error",
                duration: 6000,
            });
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <Box w='50%' >
        <Text mb={2} fontSize='lg'> Output</Text>
            <Button variant="outline" colorScheme="green" mb={4} 
            isLoading={isLoading}
            onClick={runCode}>
                
                Run Code
            </Button>
            <Box
                height="50vh"
                p={2}
                color={isError?"red.400":""}
                bgColor={"#1A1A20"}
                border="2px solid"
                borderRadius={4}
                borderColor={isError ? "red.500" : "#080809"}

            >
            {output ? output : 'Click Run Code to see the output here.'}
            </Box> 

            <Box
                height="25vh"
                p={2}
                bgColor={"#1A1A20"}
                border="4px solid"
                borderRadius={4}
                borderColor={isCorrect ? "#0FAC5B" : "#333"}
            >
            {correctChecker ? "it worked" : "pls work"}
            </Box> 
            
        </Box>
    );
};
export default Output;