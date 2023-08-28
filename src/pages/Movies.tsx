import { FC, useRef, useState } from "react"
import { selectAppState } from "../store/app/selector"
import { useAppSelector } from "../store/hooks"
import { VodStream } from "../services/XtremeCodesAPI.types"
import { Box, Modal, ModalClose, Typography } from "@mui/joy"
import { useVirtualizer } from "@tanstack/react-virtual"
import { VodInfoComponent } from "../components/VodInfoComponent"
import { MediaCarousel } from "../components/MediaCarousel"

export const Movies: FC = () => {
  const { vodStreams, vodCategories } = useAppSelector(selectAppState)
  const [currentMovie, setCurrentMovie] = useState<VodStream | undefined>(
    undefined,
  )
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: vodCategories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350,
    overscan: 5,
    paddingEnd: 50,
  })

  const onMovieClick = (movie: VodStream) => {
    console.log(movie)
    setCurrentMovie(movie)
  }

  console.log(rowVirtualizer.getVirtualItems())

  return (
    <>
      {currentMovie && (
        <Modal open={!!currentMovie} onClose={() => setCurrentMovie(undefined)}>
          <Box
            sx={{
              minWidth: 300,
              borderRadius: "md",
              p: 3,
            }}
          >
            <ModalClose variant="outlined" />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              justifyContent="center"
              display="flex"
            >
              {currentMovie?.name}
            </Typography>
            <VodInfoComponent vod={currentMovie} />
          </Box>
        </Modal>
      )}
      <div
        ref={parentRef}
        style={{
          //width: "100%",
          height: "100%",
          //maxHeight: "100%",
          //maxWidth: "100%",
          overflow: "auto",
          position: "relative",
          margin: -16,
          //overflow: "hidden",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
            //overflow: "auto",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const category = vodCategories[virtualItem.index]
            return (
              <div
                key={virtualItem.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: `${virtualItem.size}px`,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <Typography
                  level="title-lg"
                  justifyContent="center"
                  display="flex"
                >
                  {category.category_name}
                </Typography>
                <MediaCarousel
                  items={vodStreams.filter(
                    (stream) => stream.category_id === category.category_id,
                  )}
                  onStreamClick={onMovieClick}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
