import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Globe,
  Monitor,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { type ReactNode, useState } from "react";

interface TroubleOpeningHelpDialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TroubleOpeningHelpDialog({
  trigger,
  open,
  onOpenChange,
}: TroubleOpeningHelpDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-primary" />
            Trouble opening the app?
          </DialogTitle>
          <DialogDescription>
            If you see a "Canister ID Not Resolved" error, follow these
            troubleshooting steps
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                What does "Canister ID Not Resolved" mean?
              </h3>
              <p className="text-sm text-muted-foreground">
                This error appears when your browser or network cannot connect
                to the Internet Computer gateway that hosts this app.{" "}
                <strong>Your data is safe</strong> — this is a connection issue,
                not a data loss issue.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-base">Try these solutions:</h3>

              <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      1. Try a different browser
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Open the app in Chrome, Safari, Firefox, or Edge. Some
                      browsers handle Internet Computer domains differently.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <Monitor className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      2. Use incognito or private mode
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Open an incognito/private window (Ctrl+Shift+N or
                      Cmd+Shift+N). This bypasses cached data and browser
                      extensions that might interfere.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <Smartphone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      3. Switch networks
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Try switching between Wi-Fi and mobile data. Some networks
                      or firewalls block Internet Computer domains.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <RefreshCw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      4. Wait and try again later
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      If the gateway is temporarily unavailable, wait 5-10
                      minutes and refresh the page. The Internet Computer
                      network is decentralized and usually resolves quickly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <Monitor className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      5. Try a different device
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      If possible, open the app on another phone, tablet, or
                      computer to confirm whether the issue is device-specific.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Still having trouble?</strong> The issue is likely
                related to your network or internet provider blocking Internet
                Computer domains. Try the steps above from a different location
                or network.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
