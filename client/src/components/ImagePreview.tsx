import { CircularProgress, Grid, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";

interface ImagePreviewProps {
  isGeneratingImages: boolean,
  generatedImagesUrl: string[],
  generatingImagesError: boolean,
  setZoomedImageUrl: (imageUrl: string) => any
}

function ImagePreview({ isGeneratingImages, generatedImagesUrl, generatingImagesError, setZoomedImageUrl }: ImagePreviewProps) {
  const useBreakpoint = () => {
    const theme = useTheme()
    const breakpoints = theme.breakpoints.keys
    const matchingBreakpoint = breakpoints.filter((key) => useMediaQuery(theme.breakpoints.only(key))).toString()

    return matchingBreakpoint ? matchingBreakpoint : 'xs'
  }
  
  const breakpoint = useBreakpoint()
  const colsBreakpoints: {[key: string]: number} = {
    'xl': 4,
    'lg': 4,
    'md': 2,
    'sm': 2,
    'xs': 1,
  }
  const cols = colsBreakpoints[breakpoint]

  return (
    !generatedImagesUrl.length ? '' :
      <Grid alignContent={'center'} sx={{ height: isGeneratingImages || generatingImagesError ? 'calc(100vh - 64px - 128px)' : 'auto'}}>
        {isGeneratingImages ? <CircularProgress/> :
          generatingImagesError ? <ErrorGeneratingImages /> :
          <ImageList 
            cols={cols}
            rowHeight={268} 
            gap={12} 
            sx={{ width: { xl: 1072, lg: 1072, md: 548, sm: 548, xs: 268} }}>
            {generatedImagesUrl.map((imageUrl, index) => (
              <ImageListItem key={index}>
                <img
                  src={imageUrl}
                  loading="lazy"
                  onClick={() => setZoomedImageUrl(generatedImagesUrl[index])}
                  style={{ cursor: 'pointer'}}
                />
              </ImageListItem>
            ))}
          </ImageList>
        }
      </Grid>
  )
}

function ErrorGeneratingImages() {
  return(
    <Grid textAlign={'center'} alignItems={'center'}>
      <img src="/error.png" width={164}/>
      <Typography>Sorry we couldn't process your query.</Typography>
    </Grid>
  )
}

export default ImagePreview