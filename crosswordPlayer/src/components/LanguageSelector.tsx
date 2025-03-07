import { useState, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    SelectChangeEvent, 
    Button 
} from '@mui/material';
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
    const [analysisLanguages, setAnalysisLanguages] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    useEffect(() => {
        setSelectedProject('');
        setSelectedLanguage('');
        setSelectedAnalysis('');
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
                const language = await fetchVernacularLanguages(value);
                if (language) {
                    setSelectedLanguage(language);
                    try {
                        const analysisLanguages = await fetchAnalysisLanguages(value);
                        if (analysisLanguages) {
                            const languages = analysisLanguages.flat().filter(Boolean);
                            setAnalysisLanguages(languages);
                        }
                    } catch (err) {
                        console.error("Error fetching analysis languages:", err);
                    }
                }
            } catch (err) {
                console.error("Error fetching languages:", err);
            }
        }
    };

    const handleAnalysisChange = async (event: SelectChangeEvent) => {
        const value = event.target.value;
        
        if (value) {
            setSelectedAnalysis(value);
        }
    };

    const handleGenerateCrossword = async () => {
        if (selectedProject && selectedLanguage && selectedAnalysis) {
            setIsGenerating(true);
            try {
                const crosswordData = await generateCrossword(
                    selectedProject, 
                    selectedLanguage, 
                    selectedAnalysis
                );
                if (crosswordData) {
                    onCrosswordGenerated(crosswordData);
                }
            } catch (err) {
                console.error("Error generating crossword:", err);
            } finally {
                setIsGenerating(false);
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

            {selectedLanguage && (
                <Box sx={{ mb: 2, p: 1.5, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Selected Language
                    </Typography>
                    <Typography variant="body1">
                        {selectedLanguage}
                    </Typography>
                </Box>
            )}
            
            <FormControl 
                fullWidth 
                size="small" 
                sx={{ mb: 2 }}
                disabled={!selectedProject || !selectedLanguage}
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

            <Button 
                variant="contained" 
                color="primary"
                disabled={!selectedProject || !selectedLanguage || !selectedAnalysis || isGenerating}
                onClick={handleGenerateCrossword}
                fullWidth
            >
                {isGenerating ? 'Generating...' : 'Generate Crossword'}
            </Button>
        </Box>
    );
};


export default LanguageSelector;