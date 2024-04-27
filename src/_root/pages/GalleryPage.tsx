import { api } from "@/apis/apiGclient";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { setMoments } from "@/state";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const moments = useSelector((state: any) => state.moments);

  const getMoments = async () => {
    try {
      // if (userId) {
      const response = await axios.get(
        `${api}/moments/${user._id}/${user._id}/moments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setMoments({ moments: response.data }));
      // }
    } catch (error) {
      console.log("error while getting user moments", error);
    }
  };

  useEffect(() => {
    getMoments();
  }, []);
  return (
    <div className="m-5">
      <div className="text-4xl font-semibold">Gallery</div>
      <div className="grid grid-cols-2 gap-1 my-5 ml-5 pb-10">
        {moments.map((moment: any) => (
          <div key={moment.id}>
            {/* Render each moment */}
            {moment.momentPath.length > 1 ? (
              <Carousel className="w-[450px] h-[450px]">
                <CarouselContent>
                  {Array.from({
                    length: moment.momentPath.length as number,
                  }).map((_, index) => (
                    <CarouselItem key={index}>
                      <Card>
                        <CardContent className="p-0">
                          {moment.momentPath?.[index]?.split(".").pop() ===
                          "mp4" ? (
                            // If it's a video, render a <video> tag
                            <div className="flex justify-center items-center">
                              <video
                                controls
                                className="rounded-lg max-w-[450px] h-[450px] "
                                onClick={() =>
                                  navigate(`/moment/${moment._id}`)
                                }
                              >
                                <source
                                  src={`${api}/moments/${moment.momentPath?.[index]}`}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <img
                              src={`${api}/moments/${moment.momentPath?.[index]}`}
                              className="rounded-lg w-[450px] h-[450px]"
                              onClick={() => navigate(`/moment/${moment._id}`)}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext className="obsolute right-0 bg-primary opacity-50 scale-50 hover:opacity-100 hover:scale-75 transition-all" />
                <CarouselPrevious className="obsolute left-0 bg-primary opacity-50 scale-50 hover:opacity-100 hover:scale-75 transition-all" />
              </Carousel>
            ) : (
              <Card>
                <CardContent className="p-0">
                  {moment.momentPath?.[0]?.split(".").pop() === "mp4" ? (
                    // If it's a video, render a <video> tag
                    <video
                      controls
                      className="rounded-lg w-[450px] h-[450px]"
                      onClick={() => navigate(`/moment/${moment._id}`)}
                    >
                      <source
                        src={`${api}/moments/${moment.momentPath?.[0]}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    // If it's an image, render an <img> tag
                    <img
                      src={`${api}/moments/${moment.momentPath?.[0]}`}
                      className="rounded-lg w-[450px] h-[450px]"
                      onClick={() => navigate(`/moment/${moment._id}`)}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
