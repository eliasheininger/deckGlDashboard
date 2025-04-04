"use client";
import React, { useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { GenerationMixPieChart } from "@/components/Charts/GenerationMixPieChart";
import { InstalledCapacityPieChart } from "@/components/Charts/InstalledCapacityPieChart";
import useSWR from "swr";
import { useTheme } from "next-themes";
import { InstalledCapacityBarChartStacked } from "@/components/Charts/InstalledCapacityBarChartstacked";
import { GenerationMixBarChartStacked } from "@/components/Charts/GenerationMixBarChartStacked";
import { ScrollBar } from "../../../components/ui/scroll-area";
import HoverTextTooltip from "@/utilities/TooltipInfo/HoverTextTooltip/HoverTextTooltip";
import { Generation_info } from "@/utilities/TooltipInfo/ExplainerText/GenerationMix";
import { Installed_capacity_info } from "@/utilities/TooltipInfo/ExplainerText/InstalledCapacity";
import ChartInfoTooltip from "@/utilities/TooltipInfo/HoverComponents/ChartInfoTooltip";
import { CircleFlag } from "react-circle-flags";

type Props = {
  selectedCountry: string;
  isParentOpen: boolean;
  setIsParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BottomDrawer = ({
  selectedCountry,
  isParentOpen,
  setIsParentOpen,
}: Props) => {
  const { data: capacityComparisonData } = useSWR(
    `/api/capacity_comparison/${selectedCountry}`,
    fetcher,
  );

  const { data: generationComparisonData } = useSWR(
    `/api/generation_comparison/${selectedCountry}`,
    fetcher,
  );

  const { data: demandComparisonData } = useSWR(
    `/api/demand_comparison/${selectedCountry}`,
    fetcher,
  );

  const capacityComparisonRef = useRef(capacityComparisonData);
  const generationComparisonRef = useRef(generationComparisonData);
  const demandComparisonRef = useRef(demandComparisonData);

  useEffect(() => {
    capacityComparisonRef.current = capacityComparisonData;
  }, [capacityComparisonData]);

  useEffect(() => {
    generationComparisonRef.current = generationComparisonData;
  }, [generationComparisonData]);

  useEffect(() => {
    demandComparisonRef.current = demandComparisonData;
  }, [demandComparisonData]);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (open) {
      setIsParentOpen(false);
    } else {
      setIsParentOpen(true);
    }
  }, [open]);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full bg-destructive dark:bg-secondary text-primary text-[1rem] hover:text-foreground dark:hover:bg-background dark:text-card-foreground"
          onClick={() => setOpen(!open)}
        >
          Show Statistics for country : {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center gap-6 mt-3">
          <DrawerHeader className="w-full flex items-center gap-2">
            <CircleFlag
              countryCode={selectedCountry.toLowerCase()}
              height={30}
              className="aspect-square h-20 mr-2"
            />
            <div>
              <DrawerTitle className="text-4xl">
                {Installed_capacity_info.full_name} and{" "}
                {Generation_info.full_name}
              </DrawerTitle>
              <DrawerDescription className="">
                comparision across different models
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <GenerationMixPieChart data={generationComparisonRef} />
          <GenerationMixBarChartStacked data={generationComparisonRef} />
          <InstalledCapacityBarChartStacked data={capacityComparisonRef} />
          <InstalledCapacityPieChart data={capacityComparisonRef} />
          <DrawerFooter className="w-full border-t">
            <DrawerClose>
              <Button className="w-[90%] bg-destructive dark:bg-secondary text-primary text-[1rem] hover:text-foreground dark:hover:bg-background dark:text-card-foreground">
                CLOSE
              </Button>
            </DrawerClose>
          </DrawerFooter>
          {/* <ScrollBar className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300" /> */}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer;
