import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FolderOpen } from "lucide-react";
import { useState } from "react";
import type { PortfolioItem } from "../backend";
import PortfolioItemDetail from "../components/PortfolioItemDetail";
import { useGetPortfolio } from "../hooks/queries/usePortfolio";

export default function PortfolioPage() {
  const { data: portfolio = [], isLoading } = useGetPortfolio();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Your Portfolio
          </CardTitle>
          <CardDescription>Browse your saved posters</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : portfolio.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No saved posters yet. Generate and save your first poster!
              </div>
            ) : (
              <div className="space-y-3">
                {portfolio.map((item) => (
                  <button
                    type="button"
                    key={String(item.postTimestamp)}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedItem === item
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="font-medium line-clamp-2">
                        {item.reflection.title}
                      </div>
                      <div className="text-xs opacity-75 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(
                          Number(item.postTimestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs opacity-75">
                        Template: {item.template.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        {selectedItem ? (
          <PortfolioItemDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground py-12">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a portfolio item to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
