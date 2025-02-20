import React, { useState } from 'react';
import { Collapse, Grid, IconButton, List, ListItem, Box, Select, MenuItem, Tooltip, Typography } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { DeleteOutlined, UploadFileOutlined } from '@mui/icons-material';
import ImportFilesDropzone from '@components/common/files/import_files/ImportFilesDropzone';
import ImportFilesFreeText from '@components/common/files/import_files/ImportFilesFreeText';
import { graphql, useFragment } from 'react-relay';
import { useFormatter } from '../../../../../components/i18n';
import { ImportFilesUploader_connectors$key } from './__generated__/ImportFilesUploader_connectors.graphql';

const importFilesUploaderFragment = graphql`
  fragment ImportFilesUploader_connectors on Query {
    connectorsForImport {
      id
      name
      active
      only_contextual
      connector_scope
      updated_at
      configurations {
        id
        name
        configuration
      }
    }
  }
`;

export type FileWithConnectors = {
  file: File;
  connectors: { id: string; name: string }[];
};

interface ImportFilesUploaderProps {
  files?: FileWithConnectors[];
  onChange: (files: FileWithConnectors[]) => void;
  connectorsData: ImportFilesUploader_connectors$key;
}

const ImportFilesUploader = ({ files = [], onChange, connectorsData }: ImportFilesUploaderProps) => {
  const { t_i18n } = useFormatter();
  const [isTextView, setIsTextView] = useState(false);

  const { connectorsForImport } = useFragment(importFilesUploaderFragment, connectorsData);
  console.log({ connectorsForImport });
  const addFiles = (newFiles: File[]) => {
    const extendedFiles: FileWithConnectors[] = newFiles.map((file) => {
      const matchingConnectors = connectorsForImport.filter((connector) => connector.connector_scope.includes(file.type));

      return { file, connectors: matchingConnectors.map(({ id, name }) => ({ id, name })) };
    });
    console.log({ extendedFiles });
    onChange([...files, ...extendedFiles]);
  };

  const removeFile = (name: string) => {
    onChange(files.filter(({ file }) => file.name !== name));
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        { !isTextView ? (
          <ImportFilesDropzone
            fullSize={files.length === 0}
            onChange={addFiles}
            openFreeText={() => setIsTextView(true)}
          />
        ) : (
          <ImportFilesFreeText onSumbit={(file) => {
            addFiles([file]);
            setIsTextView(false);
          }}
            onClose={ () => setIsTextView(false) }
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <List>
          <TransitionGroup>
            {files.length > 0 && (
              <Collapse key="header" >
                <ListItem divider>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={0.5}></Grid>
                    <Grid item xs={5}>
                      <Typography fontWeight="bold">
                        {t_i18n('File')}
                      </Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Typography fontWeight="bold">
                        {t_i18n('Connectors')}
                      </Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Typography fontWeight="bold">
                        {t_i18n('CSV Mappers')}
                      </Typography>
                    </Grid>

                    <Grid item xs={0.5}></Grid>
                  </Grid>
                </ListItem>
              </Collapse>
            )}

            {files.map(({ file, connectors }) => (
              <Collapse key={file.name}>
                <ListItem divider dense>
                  <Grid container alignItems="center" columnSpacing={2}>
                    {/* Column 1: File Icon */}
                    <Grid item xs={0.5} sx={{ display: 'flex' }}>
                      <UploadFileOutlined color="primary" />
                    </Grid>

                    {/* Column 2: File Name */}
                    <Grid item xs={5}>
                      <Tooltip title={file.name}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {file.name}
                        </Box>
                      </Tooltip>
                    </Grid>

                    {/* Column 3: Select - Show all connectors but disable those not in `connectors` */}
                    <Grid item xs={3}>
                      <Select variant="standard" fullWidth value={connectors.map((c) => c.id)} multiple>
                        {connectorsForImport.map((connector) => (
                          <MenuItem key={connector.id} value={connector.id} disabled={!connectors.some((c) => c.id === connector.id)}>
                            {connector.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    {/* Column 4: Select - CSV Mapper */}
                    <Grid item xs={3}>
                      <Select variant="standard" fullWidth value="">
                        <MenuItem value="">None</MenuItem>
                        {connectorsForImport.map((connector) => (
                          <MenuItem key={connector.id} value={connector.id}>
                            {connector.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    {/* Column 5: Delete Button */}
                    <Grid item xs={0.5}>
                      <IconButton edge="end" onClick={() => removeFile(file.name)} color="primary">
                        <DeleteOutlined />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              </Collapse>
            ))}
          </TransitionGroup>
        </List>
      </Grid>
    </Grid>
  );
};

export default ImportFilesUploader;
