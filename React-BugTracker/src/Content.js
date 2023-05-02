import React from 'react';
import Box from '@mui/material/Box';
import ProjectCard from './ProjectCard';

export default function ProjectCardList({ projects }) {
    return (
        <Box
            sx={{
                display: 'row',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px',

            }}
        >
            {projects.map(project => (
                <ProjectCard
                    key={project.project_id}
                    project={project}
                />
            ))}
        </Box>
    );
}
