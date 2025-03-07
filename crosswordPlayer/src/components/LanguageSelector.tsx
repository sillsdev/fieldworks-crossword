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
import { LanguageSelectorProps, Publication } from '../types/types';

const LanguageSelector = ({ 
    onCrosswordGenerated,
    selectedProject,
    selectedLanguage,
    selectedAnalysis,
    selectedPublication,
    setSelectedProject,
    setSelectedLanguage,
    setSelectedAnalysis,
    setSelectedPublication
 }: LanguageSelectorProps) => {
    const {
        fetchProjects, 
        generateCrossword,
        fetchVernacularLanguages,
        fetchAnalysisLanguages,
        fetchPublications
     } = useLanguageGenerator(); 
    const [projects, setProjects] = useState<string[]>([]);
    const [analysisLanguages, setAnalysisLanguages] = useState<string[]>([]);
    const [publications, setPublications] = useState<Publication[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    useEffect(() => {
        setSelectedProject('');
        setSelectedLanguage('');
        setSelectedAnalysis('');
        setSelectedPublication('');
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
            setSelectedAnalysis('');
            setSelectedPublication('');
            
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

                        const fetchedPublications = await fetchPublications(value);
                        if (fetchedPublications) {
                            console.log("Fetched publications:", fetchedPublications);
                            setPublications(fetchedPublications);
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

    const handlePublicationChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value) {
            setSelectedPublication(value);
        }
    };

    const handleGenerateCrossword = async () => {
        if (selectedProject && selectedLanguage && selectedAnalysis) {
            setIsGenerating(true);
            try {
                const crosswordData = await generateCrossword(
                    selectedProject, 
                    selectedLanguage, 
                    selectedAnalysis,
                    selectedPublication
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

            <FormControl
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled={!selectedProject || !selectedLanguage}
            >
                <InputLabel id="publication-select-label">Select Publication</InputLabel>
                <Select
                    labelId="publication-select-label"
                    id="publication-select"
                    value={selectedPublication}
                    label="Select Publication"
                    onChange={handlePublicationChange}
                >
                    {publications.map((publication, index) => (
                        <MenuItem
                            key={`${publication.publicationID}-${index}`}
                            value={publication.publicationID}
                        >
                            {publication.publicationName}
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