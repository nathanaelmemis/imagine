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
      const preprocessResponse = await axios.post('/api/preprocess', { query: query });
      const labels = preprocessResponse.data.labels;

      if (!labels.length) {
        throw new Error('No labels found')
      }

      console.log(labels)

      const generateResponse = await axios.post('https://imagine.automos.net/label/generate', { labels: labels });
      const imageUrls = generateResponse.data.image_urls;

      console.log(imageUrls)

      async function imageUrlToBase64(url: string) {
        try {
          // Fetch the image as a blob
          const response = await fetch(url);
          const blob = await response.blob();

          // Read the blob as a data URL
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error converting image to base64:', error);
          return null; // Handle error and return null if conversion fails
        }
      }

      // convert image urls to base64
      const base64EncodedImages = await Promise.all(imageUrls.map((url: string) => imageUrlToBase64(url)));

      if (!base64EncodedImages.length) {
        throw new Error('Cannot encode images to base64')
      }

      console.log(base64EncodedImages)

      setGeneratedImageUrl(base64EncodedImages.length ? base64EncodedImages : ['dummy_data'])
      setGeneratingImagesError(false)
    } catch (error) {
      setQueryError(true)
      setGeneratingImagesError(true)
      console.log(error)
    }

    setIsGeneratingImages(false)
  }

  useEffect(() => {
    try {
      async function fetchClassOptions() {
        const res = await axios.get('/api/labels')
        const labels: string[] = res.data

        // filter out duplicate labels
        const uniqueLabels: string[] = [...new Set(labels)]

        setClassOptions(uniqueLabels)
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
        width: { md: '60%', sm: '80%', xs: '95%' },
        mt: 1,
        mb: 2
      }}>
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
              key={2} />
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