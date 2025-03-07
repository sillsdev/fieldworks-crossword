import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import useLanguageGenerator from '../hooks/useLanguageGenerator';
import { LanguageSelectorProps } from '../types/types';

const LanguageSelector = ({ 
    onCrosswordGenerated,
    selectedProject,
    selectedLanguage,
    selectedAnalysis,
    setSelectedProject,
    setSelectedLanguage,
    setSelectedAnalysis
 }: LanguageSelectorProps) => {
    const {
        fetchProjects, 
        generateCrossword,
        fetchVernacularLanguages,
        fetchAnalysisLanguages
     } = useLanguageGenerator(); 
    const [projects, setProjects] = useState<string[]>([]);
    const [menuLanguages, setMenuLanguages] = useState<string[]>([]);
    const [analysisLanguages, setAnalysisLanguages] = useState<string[]>([]);

    useEffect(() => {
        const loadProjects = async () => {
          try {
            const fetchedProjects = await fetchProjects();
            if (fetchedProjects) {
              setProjects(fetchedProjects);
            }
          } catch (err) {
            console.error("Error fetching languages:", err);
          }
        };
        
        loadProjects();
    }, [fetchProjects]);

    const handleProjectChange = async (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value) {
            setSelectedProject(value);
            setSelectedLanguage('');
            try {
                const languages = await fetchVernacularLanguages(value);
                if (languages) {
                    const languageCodes = languages.flat().filter(Boolean);
                    setMenuLanguages(languageCodes);
                }
            } catch (err) {
                console.error("Error fetching languages:", err);
            }
        }
    };

    const handleLanguageChange = async (event: SelectChangeEvent) => {
        const value = event.target.value;
        
        if (value) {
          setSelectedLanguage(value);

          try {
            const analysisLanguages = await fetchAnalysisLanguages(selectedProject);
            if (analysisLanguages) {
                const languages = analysisLanguages.flat().filter(Boolean);
                setAnalysisLanguages(languages);
            }
          } catch (err) {
            console.error("Error generating crossword:", err);
          }
        }
    };

    const handleAnalysisChange = async (event: SelectChangeEvent) => {
        const value = event.target.value;
        
        if (value) {
            setSelectedAnalysis(value);
            try {
                const crosswordData = await generateCrossword(
                    selectedProject, 
                    selectedLanguage, 
                    value
                );
            if (crosswordData) {
                onCrosswordGenerated(crosswordData);
            }
            } catch (err) {
                console.error("Error generating crossword:", err);
            }
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="project-select-label">Select Project</InputLabel>
                <Select
                    labelId="project-select-label"
                    id="project-select"
                    value={selectedProject}
                    label="Select Project"
                    onChange={handleProjectChange}
                >
                    {projects.map((project) => (
                        <MenuItem
                            key={project}
                            value={project}
                        >
                            {project}
                        </MenuItem>
                        ))
                    }
                </Select>
            </FormControl> 

            <FormControl 
                fullWidth 
                size="small" 
                sx={{ mb: 2 }}
                disabled={!selectedProject || menuLanguages.length === 0}
            >
                <InputLabel id="language-select-label">Select Language</InputLabel>
                <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={selectedLanguage}
                    label="Select Language"
                    onChange={handleLanguageChange}
                >
                    {menuLanguages.map((language) => (
                        <MenuItem
                            key={language}
                            value={language}
                        >
                            {language}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl 
                fullWidth 
                size="small" 
                sx={{ mb: 2 }}
                disabled={!selectedProject && !selectedLanguage}
            >
                <InputLabel id="analysis-select-label">Select Analysis Language</InputLabel>
                <Select
                    labelId="analysis-select-label"
                    id="analysis-select"
                    value={selectedAnalysis}
                    label="Select Analysis Language"
                    onChange={handleAnalysisChange}
                >
                    {analysisLanguages.map((language) => (
                        <MenuItem
                            key={language}
                            value={language}
                        >
                            {language}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};


export default LanguageSelector;