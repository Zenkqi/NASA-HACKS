import { Box, HStack, Text } from "@chakra-ui/react";
import { PROBLEM } from "../constants";


const Question = ({problem})=>{
    return(
        <Box w='100%'
        height="35vh"
        p={2}
        bgColor={"#1A1A20"}
        border="4px solid"
        borderRadius={4}
        borderColor={"#333"}
        >
            <Text mb={2} fontSize='lg'> {problem}</Text>
            <Text mb={2} fontSize='lg'> {PROBLEM[problem]}</Text>

        </Box>
    )
}
export default Question;