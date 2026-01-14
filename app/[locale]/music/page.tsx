import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icon } from "@iconify/react"

const topSongs = [
  { title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: "4:03" },
  { title: "Instant Crush", artist: "Daft Punk ft. Julian Casablancas", album: "Random Access Memories", duration: "5:37" },
  { title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", duration: "3:36" },
  { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
  { title: "Nightcall", artist: "Kavinsky", album: "OutRun", duration: "4:18" },
]

export default function MusicPage() {
  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-24">
      {/* Background Element */}
      <div className="absolute -bottom-20 -left-20 z-0 opacity-5 dark:opacity-[0.02]">
        <Icon icon="ph:music-notes-simple-thin" width={600} height={600} />
      </div>

      <div className="relative z-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Music Share</h1>
          <p className="text-muted-foreground">Some tracks that have been on repeat lately.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Now Playing (Hypothetical)</CardTitle>
              <CardDescription>What's currently spinning.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-md border p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded bg-primary/10 text-primary">
                  <Icon icon="ph:disc-fill" className="h-8 w-8 animate-spin-slow" />
                </div>
                <div>
                  <p className="font-semibold">Midnight City</p>
                  <p className="text-sm text-muted-foreground">M83</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Playlist</CardTitle>
              <CardDescription>My top picks.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full pr-4">
                <div className="space-y-4">
                  {topSongs.map((song, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="w-4 text-center text-sm text-muted-foreground">{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium leading-none">{song.title}</p>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{song.duration}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
