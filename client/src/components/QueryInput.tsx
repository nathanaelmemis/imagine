import { useEffect, useState } from "react"

import { Autocomplete, Button, Grid, TextField } from "@mui/material"

import axios from "axios"

interface QueryInputProps {
  generatedImagesUrlLength: number,
  setIsGeneratingImages: (state: boolean) => any,
  setGeneratingImagesError: (state: boolean) => any,
  setGeneratedImageUrl: (generatedImageUrl: string[]) => any
}

function QueryInput({ generatedImagesUrlLength, setIsGeneratingImages, setGeneratingImagesError, setGeneratedImageUrl }: QueryInputProps) {
  const [query, setQuery] = useState('')
  const [queryError, setQueryError] = useState(false)
  const [classOptions, setClassOptions] = useState<string[]>([''])

  const handleChangeQueryInput = (_event: React.SyntheticEvent, value: string) => {
    if (queryError) {
      setQueryError(false)
    }

    setQuery(value)
  }

  const handleClickGenerateButton = async () => {
    if (!query) {
      setQueryError(true)
      return
    }

    if (!generatedImagesUrlLength) {
      setGeneratedImageUrl(['dummy_data'])
    }

    setIsGeneratingImages(true)

    try {
      const preprocessResponse = await axios.post('/api/preprocess', { query: query});
      const labels = preprocessResponse.data.labels;

      const generateResponse = await axios.post('https://imagine.automos.net/label/generate', { labels: labels });
      const imageUrls = generateResponse.data.imageUrls;

      const postprocessResponse = await axios.post('/api/postprocess', { imageUrls: imageUrls});
      const base64EncodedImages = postprocessResponse.data.base64EncodedImages;

      if (base64EncodedImages.length) {
        setGeneratedImageUrl(base64EncodedImages.length ? base64EncodedImages : ['dummy_data'])
        setGeneratingImagesError(false)
      } else {
        setGeneratingImagesError(true)
      }
    } catch {
      setQueryError(true)
    }

    setIsGeneratingImages(false)
  }

  useEffect(() => {
    try {
      async function fetchClassOptions() {
        const res = await axios.get('/api/labels')

        setClassOptions(res.data)
      }
      fetchClassOptions()
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <Grid 
      container 
      alignItems={'center'} 
      spacing={1} 
      sx={{ 
        width: { md: '60%', sm: '80%', xs: '95%'}, 
        mt: 1,
        mb: 2}}>
      <Grid item sx={{ flex: 1 }}>
        <Autocomplete
          id='queryInput'
          freeSolo
          options={classOptions}
          onChange={(event, value) => handleChangeQueryInput(event, value || '')}
          renderInput={(params) => {
            return <TextField
              onChange={(event) => handleChangeQueryInput(event, event.target.value || '')}
              {...params}
              error={queryError}
              label="Query Input"
              size='small'
              key={2}/>
          }} />
      </Grid>
      <Grid item>
        <Button
          variant='contained'
          onClick={handleClickGenerateButton}>Generate</Button>
      </Grid>
    </Grid>
  )
}

export default QueryInput