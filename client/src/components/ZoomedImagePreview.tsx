import { Modal, Box, IconButton } from "@mui/material";
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';

interface ZoomedImagePreviewProps {
  zoomedImageUrl: string,
  setZoomedImageUrl: (imageUrl: string) => any
}

function ZoomedImagePreview({zoomedImageUrl, setZoomedImageUrl}: ZoomedImagePreviewProps) {
  const handleClickDownloadImage = async () => {
    const response = await fetch(zoomedImageUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement("a");
    link.href = blobUrl
    link.download = 'generated_image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)
  }

  return (
    <Modal
      open={!!zoomedImageUrl}
      onClose={() => setZoomedImageUrl('')}>
      <Box>
        <Box sx={{ position: 'absolute', top: '0', right: '0', zIndex: 1 }}>
          <IconButton size='large' onClick={() => handleClickDownloadImage()}>
            <DownloadIcon color="secondary" />
          </IconButton>
          <IconButton size='large' onClick={() => setZoomedImageUrl('')}>
            <CloseIcon color="secondary"/>
          </IconButton>
        </Box>
          <Box
            sx={{
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: {
                sm: '100vh',
                xs: '100vw'
              },
              height: {
                sm: '100vh',
                xs: '100vw'
              },
            }}>
            <img 
              src={zoomedImageUrl}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                objectFit: 'cover'
              }}/>
          </Box>
      </Box>
    </Modal>
  )
}

export default ZoomedImagePreview