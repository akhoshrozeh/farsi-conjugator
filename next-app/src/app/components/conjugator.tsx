'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"

interface ConjugatedVerbs {
    positive: string[];
    negative?: string[];
}

interface Conjugation {
  tense: string;
  conjugatedVerbs: ConjugatedVerbs[];
  // Add other properties as needed
}

interface Verb {
  writtenEnglish: string;
  writtenPersian: string;
  spokenEnglish?: string;
  spokenPersian?: string;
  meaning: string;
  isBasic: boolean;
  conjugations: {
    spokenEnglish: Conjugation[];
    writtenEnglish: Conjugation[];
    spokenPersian: Conjugation[];
    writtenPersian: Conjugation[];
  };
}

// Add this helper function at the top of the file, outside of the component
const normalizeText = (text: string): string => {
  return text.toLowerCase().replace(/ā/g, 'a');
};


interface PersianVerbExplorerProps {
  verbs: Verb[];
}

const PersianVerbExplorer: React.FC<PersianVerbExplorerProps> = ({ verbs }) => {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null)
  const [isFarsi, setIsFarsi] = useState(false)
//   console.log(typeof(verbs))
  useEffect(() => {
    if (input.length > 0) {
      const normalizedInput = normalizeText(input);
      const filtered = verbs.filter((verb: Verb) => {
        if (isFarsi) {
          return normalizeText(verb.writtenEnglish).includes(normalizedInput);
        } else {
          return normalizeText(verb.meaning).includes(normalizedInput);
        }
      });
      
      setSuggestions(filtered.map((verb: Verb) => {
        if (isFarsi) {
          return verb.writtenEnglish;
        } else {
          return verb.meaning;
        }
      }));
    } else {
      setSuggestions([]);
    }

    console.log(isFarsi)
  }, [input, isFarsi, verbs])

  const handleSelectVerb = (suggestion: string) => {
    const selectedVerbData = verbs.find((v: Verb) => 
      isFarsi 
        ? v.writtenEnglish === suggestion
        : v.meaning === suggestion
    )
    setSelectedVerb(selectedVerbData || null)
    setInput(suggestion)
    setSuggestions([])
  }

  return (
    <div className="container mx-auto p-4 text-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Persian Verb Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder={isFarsi ? "یک فعل تایپ کنید..." : "Type a verb..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <Toggle
              pressed={isFarsi}
              onPressedChange={(pressed) => {
                setIsFarsi(pressed)
                setInput('')
                setSuggestions([])
              }}
              aria-label="Toggle language"
            >
              {isFarsi ? 'FA' : 'EN'}
            </Toggle>
          </div>
          {suggestions.length > 0 && (
            <ScrollArea className="h-32 rounded-md border p-2 mb-4">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelectVerb(suggestion)}
                  dangerouslySetInnerHTML={{ __html: suggestion }}>
                  {/* {suggestion} */}
                </Button>
              ))}
            </ScrollArea>
          )}
          {selectedVerb && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{selectedVerb?.writtenEnglish}</span>
                  <span className="text-right">{selectedVerb?.writtenPersian}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isFarsi ? (
                    <>
                      {selectedVerb.spokenEnglish && (
                        <div>
                          <h3 className="font-semibold">Spoken Form:</h3>
                          <p>{selectedVerb.spokenEnglish}</p>
                        </div> 
                      )}
                      {selectedVerb.writtenEnglish && (
                        <div>
                          <h3 className="font-semibold">Written Form:</h3>
                          <p>{selectedVerb.writtenEnglish}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <h3 className="font-semibold">Meaning:</h3>
                      <p dangerouslySetInnerHTML={{ __html: selectedVerb.meaning }}></p>
                    </div>
                  )}
                  <div>
                    <Badge variant={selectedVerb.isBasic ? "default" : "secondary"}>
                      {selectedVerb.isBasic ? "Basic Verb" : "Advanced Verb"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold">Conjugations:</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedVerb.conjugations).map(([language, conjugationArray]) => (
                        <div key={language}>
                          <h4 className="font-semibold">{language}:</h4>
                          {Object.entries(conjugationArray).map(([tense, conjugations]) => (
                            <Card key={tense} className="mb-2">
                              <CardHeader>
                                <h5 className="font-medium">{tense}:</h5>
                              </CardHeader>
                              <CardContent>
                                {Object.entries(conjugations).map(([type, conjugations]) => (
                                  <div key={type}>
                                    <h6 className="font-medium">{type}:</h6>
                                    {Object.entries(conjugations).map(([key, conjugation], index) => (
                                      <p key={index}>{conjugation as string}</p>
                                    ))}
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PersianVerbExplorer