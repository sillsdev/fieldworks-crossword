import { useState, useEffect, useMemo } from 'react';
import { Box, /**FormControl, InputLabel, Select, MenuItem, SelectChangeEvent**/ } from '@mui/material';
import useLanguageGenerator from '../hooks/useLanguageGenerator';
import { LanguageData, LanguageSelectorProps } from '../types/types';
import {
    LanguagePicker,
    languagePickerStrings_en,
    LangTag,
} from "mui-language-picker";

const LanguageSelector = ({ onCrosswordGenerated }: LanguageSelectorProps) => {
    const { fetchLanguages, /**loading, error,**/ generateCrossword } = useLanguageGenerator(); 
    const [menuLanguages, setMenuLanguages] = useState<LanguageData[]>([]);
    
    const [bcp47Code, setBcp47Code] = useState<string>("");
    const [languageName, setLanguageName] = useState<string>("");
    const [fontName, setFontName] = useState<string>("");
    const [isRtl, setIsRtl] = useState<boolean>(false);
    const [languageTag, setLanguageTag] = useState<LangTag | undefined>();

    useEffect(() => {
        const loadLanguages = async () => {
          try {
            const fetchedLanguages = await fetchLanguages();
            if (fetchedLanguages) {
              setMenuLanguages(fetchedLanguages);
            }
          } catch (err) {
            console.error("Error fetching languages:", err);
          }
        };
        
        loadLanguages();
    }, [fetchLanguages]);

    const languageFilter = useMemo(() => {
        return (code: string): boolean => {
            if (menuLanguages.length === 0) return false;
            
            return menuLanguages.some(lang => 
                (code === lang.languageCode.languageName)
            );
        };
    }, [menuLanguages]);

    const getDisplayName = (name: string, tag?: LangTag) => {
        return tag?.localname ? `${tag.localname} / ${name}` : tag?.name || name;
    };

    useEffect(() => {
        if (bcp47Code && menuLanguages.length > 0) {
            const selected = menuLanguages.find(lang => 
                lang.languageCode.languageName === bcp47Code);
            
            if (selected) {
                //setSelectedLanguage(`${selected.projectName}-${selected.languageCode}`);
                const generateCrosswordForLanguage = async () => {
                    try {
                        const crosswordData = await generateCrossword(
                            selected.projectName, 
                            selected.languageCode.languageName, 
                        );
                        if (crosswordData) {
                            onCrosswordGenerated(crosswordData);
                        }
                    } catch (err) {
                        console.error("Error generating crossword:", err);
                    }
                };
                
                generateCrosswordForLanguage();
            }
        }
    }, [bcp47Code]);

    // // Original dropdown select handler
    // const handleLanguageChange = async (event: SelectChangeEvent) => {
    //     const value = event.target.value;
    //     const selected = menuLanguages.find(lang => `${lang.projectName}-${lang.languageCode}` === value);
        
    //     if (selected) {
    //       setSelectedLanguage(value);
    //       try {
    //         const crosswordData = await generateCrossword(
    //             selected.projectName, 
    //             selected.languageCode.languageName, 
    //         );
    //         if (crosswordData) {
    //             onCrosswordGenerated(crosswordData);
    //         }
    //       } catch (err) {
    //         console.error("Error generating crossword:", err);
    //       }
    //     }
    // };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
            {/* Original select dropdown */}
            {/* <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="language-select-label">Select Language</InputLabel>
                <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={selectedLanguage}
                    label="Select Language"
                    onChange={handleLanguageChange}
                    disabled={loading}
                >
                    {loading ? (
                        <MenuItem disabled>Loading languages...</MenuItem>
                    ) : error ? (
                        <MenuItem disabled>Error: {error}</MenuItem>
                    ) : menuLanguages.length === 0 ? (
                        <MenuItem disabled>No languages available</MenuItem>
                    ) : (
                        menuLanguages.map((language) => (
                            <MenuItem
                                key={`${language.projectName}-${language.languageCode}`}
                                value={`${language.projectName}-${language.languageCode}`}
                            >
                                {language.projectName} ({language.languageCode.languageName})
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl> */}
            
            {/* Language Picker component */}
            <Box sx={{ mt: 2 }}>
                <LanguagePicker
                    value={bcp47Code}
                    setCode={setBcp47Code}
                    name={languageName}
                    setName={setLanguageName}
                    font={fontName}
                    setFont={setFontName}
                    setDir={setIsRtl}
                    displayName={getDisplayName}
                    setInfo={setLanguageTag}
                    t={languagePickerStrings_en}
                    filter={languageFilter}
                />
                
                {/* Display selected language information */}
                {languageTag && (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                        <h4>Selected Language Info:</h4>
                        <p>Code: {bcp47Code}</p>
                        <p>Name: {languageName}</p>
                        <p>Direction: {isRtl ? 'RTL' : 'LTR'}</p>
                        <p>Font: {fontName || 'Default'}</p>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default LanguageSelector;