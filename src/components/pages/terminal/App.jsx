import { Box } from "@chakra-ui/react"
import CodeEditor from "../terminal/component/CodeEditor";



function App() {
  return <Box minH="50vh" bg = "#080809" color="gray.500" px={10} py={8}>
    <CodeEditor/>
    </Box>;
} 
export default App;
