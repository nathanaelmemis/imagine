import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import QueryInput from './components/QueryInput';
import ImagePreview from './components/ImagePreview';
import ZoomedImagePreview from './components/ZoomedImagePreview';

function App() {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [generatingImagesError, setGeneratingImagesError] = useState(false)
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string>('')
  const [generatedImagesUrl, setGeneratedImageUrl] = useState<string[]>([])

  return (
    <Stack 
      alignItems={'center'} 
      justifyContent={'center'} 
      height={generatedImagesUrl.length ? 'auto' : '100vh'}
      sx={{ backgroundColor: 'primary.light' }}>
      <Typography 
        color={'primary.main'}
        variant={generatedImagesUrl.length ? 'h3' : 'h1'}
        sx={{ mt: generatedImagesUrl.length ? 1 : 0 }}>Imagine</Typography>
      <QueryInput 
        generatedImagesUrlLength={generatedImagesUrl.length}
        setIsGeneratingImages={setIsGeneratingImages} 
        setGeneratingImagesError={setGeneratingImagesError}
        setGeneratedImageUrl={setGeneratedImageUrl}/>
      <ImagePreview 
        isGeneratingImages={isGeneratingImages}
        generatedImagesUrl={generatedImagesUrl}
        generatingImagesError={generatingImagesError}
        setZoomedImageUrl={setZoomedImageUrl}/>
      <ZoomedImagePreview 
        zoomedImageUrl={zoomedImageUrl}
        setZoomedImageUrl={setZoomedImageUrl}/>
    </Stack>
  )
}

export default App
