import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventDetailsDialog from "@/components/event-detail";
import Grid from "@/components/grid-bg";

import StartupCafeForm from "@/components/event-forms/startup-cafe";
import StartupMughavariForm from "@/components/event-forms/startup-mughavari";
import InternHuntForm from "@/components/event-forms/intern-hunt";
import StartupAtlasForm from "@/components/event-forms/startup-atlas";
import ScholarSpinOffForm from "@/components/event-forms/scholar-spinoff";
import StartUpPathFinderForm from "@/components/event-forms/startup-path-finder";
import PitchXForm from "@/components/event-forms/pitch-x";
import GurusPitchForm from "@/components/event-forms/guru-pitch";
import StartupDistrictForm from "@/components/event-forms/startup-district";
import GoldenStarECellAwardsForm from "@/components/event-forms/golden-ecell";
import FounderFindForm from "@/components/event-forms/founder-find";
import IpToIpoForm from "./event-forms/ip-to-ipo";

interface AboutCardProps {
  id: string;
  title: string;
  description: string;
  prizeAmount: string;
  regFee: string;
  imageSrc: string;
}

export default function AboutCard({
  id,
  title,
  description,
  prizeAmount,
  regFee,
  imageSrc,
}: AboutCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const formComponents: {
    [key: string]: React.FC<{ onPaymentBtnOpen: (open: boolean) => void }>;
  } = {
    "startup-cafe": StartupCafeForm,
    "startup-mughavari": StartupMughavariForm,
    "intern-hunt": InternHuntForm,
    "startup-atlas": StartupAtlasForm,
    "scholars-spin-off": ScholarSpinOffForm,
    "path-finder": StartUpPathFinderForm,
    "pitch-x": PitchXForm,
    "gurus-pitch": GurusPitchForm,
    "founder-find": FounderFindForm,
    "startup-district": StartupDistrictForm,
    "e-cell-awards": GoldenStarECellAwardsForm,
    "ip-to-ipo": IpToIpoForm,
  };

  const FormComponent = formComponents[id];

  const handleApply = () => {
    setDetailsOpen(false);
    setFormOpen(true);
  };

  if (!FormComponent) {
    return (
      <div className="relative flex flex-col text-left bg-purple-700 p-6 rounded-3xl border border-purple-900 overflow-hidden">
        <Grid size={20} />
        <TypographyH4 className="text-[22px] underline underline-offset-2 decoration-purple-300 text-white">
          {title}
        </TypographyH4>
        <TypographyP className="text-white">{description}</TypographyP>
        <Badge
          variant="secondary"
          className="absolute bottom-2 right-2 bg-purple-500 text-white hover:bg-purple-600"
        >
          Registration Opens Soon
        </Badge>
      </div>
    );
  }

  return (
    <>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <div className="relative h-full flex flex-col text-left bg-purple-700 p-6 rounded-3xl border border-purple-900 overflow-hidden cursor-pointer">
            <Grid size={20} />
            <TypographyH4 className="text-[22px] underline underline-offset-2 decoration-purple-300 text-white">
              {title}
            </TypographyH4>
            <TypographyP className="text-white">{description}</TypographyP>
            <Badge
              variant="secondary"
              className="absolute bottom-2 right-2 bg-purple-500 text-white hover:bg-purple-600"
            >
              View Details
            </Badge>
          </div>
        </DialogTrigger>
        <EventDetailsDialog
          id={id}
          title={title}
          description={description}
          prizeAmount={prizeAmount}
          regFee={regFee}
          imageSrc={imageSrc}
          onApply={handleApply}
        />
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogTrigger asChild>
          <span style={{ display: "none" }}></span>
        </DialogTrigger>
        <DialogContent className="h-[90%] p-2">
          <ScrollArea>
            <FormComponent onPaymentBtnOpen={setFormOpen} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
