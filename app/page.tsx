"use client";

import { useState } from "react";
import { FaceIDAuth } from "./components/FaceIDAuth";
import { Dashboard } from "./components/Dashboard";
import { RestrictedAccessModal } from "./components/RestrictedAccessModal";
import { NewFolderSheet } from "./components/NewFolderSheet";
import { Settings } from "./components/Settings";
import { FolderContents } from "./components/FolderContents";
import { IdentityVerificationModal } from "./components/IdentityVerificationModal";
import { SecureViewer } from "./components/SecureViewer";
import { LoginActivity } from "./components/LoginActivity";
import { Onboarding } from "./components/Onboarding";
import { FolderDetailView } from "./components/FolderDetailView";

type Screen = 'onboarding' | 'auth' | 'dashboard' | 'settings' | 'folder' | 'viewer' | 'activity' | 'folderDetail';

export default function VaultPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showNewFolderSheet, setShowNewFolderSheet] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFolderSecurity, setSelectedFolderSecurity] = useState<'standard' | 'enhanced' | 'maximum'>('enhanced');

  const handleAuthenticate = () => {
    setCurrentScreen('dashboard');
  };

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(folderName);
    setShowRestrictedModal(true);
  };

  const handleUnlockFolder = () => {
    setShowRestrictedModal(false);
    // Navigate to folder contents
    setCurrentScreen('folder');
  };

  const handleSettingsClick = () => {
    setCurrentScreen('settings');
  };

  const handleActivityClick = () => {
    setCurrentScreen('activity');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    setShowIdentityModal(true);
  };

  const handleIdentityVerified = () => {
    setShowIdentityModal(false);
    // Navigate to secure viewer
    setCurrentScreen('viewer');
  };

  const handleLockDocument = () => {
    // Return to folder contents
    setCurrentScreen('folder');
  };

  const handleCreateFolder = (folderName: string, securityLevel: 'standard' | 'enhanced' | 'maximum') => {
    setSelectedFolder(folderName);
    setSelectedFolderSecurity(securityLevel);
    setCurrentScreen('folderDetail');
  };

  const handleAddItemToFolder = (type: 'text' | 'voice' | 'photo' | 'scan') => {
    console.log('Add item to folder:', type);
    // This would open the appropriate creation form
  };

  return (
    <>
      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={() => setCurrentScreen('auth')} />
      )}

      {currentScreen === 'auth' && (
        <FaceIDAuth onAuthenticate={handleAuthenticate} />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard
          onFolderClick={handleFolderClick}
          onSettingsClick={handleSettingsClick}
          onNewFolderClick={() => setShowNewFolderSheet(true)}
        />
      )}

      {currentScreen === 'settings' && (
        <Settings onBack={handleBackToDashboard} />
      )}

      {currentScreen === 'folder' && (
        <FolderContents
          folderName={selectedFolder}
          onBack={handleBackToDashboard}
          onFileClick={handleFileClick}
        />
      )}

      {currentScreen === 'viewer' && (
        <SecureViewer
          fileName={selectedFile}
          fileSize="2.4 MB"
          onBack={() => setCurrentScreen('folder')}
          onLock={handleLockDocument}
        />
      )}

      {currentScreen === 'activity' && (
        <LoginActivity onBack={handleBackToDashboard} />
      )}

      {currentScreen === 'folderDetail' && (
        <FolderDetailView
          folderName={selectedFolder}
          securityLevel={selectedFolderSecurity}
          onBack={handleBackToDashboard}
          onAddItem={handleAddItemToFolder}
        />
      )}

      {/* Modals */}
      <RestrictedAccessModal
        isOpen={showRestrictedModal}
        onClose={() => setShowRestrictedModal(false)}
        onUnlock={handleUnlockFolder}
        folderName={selectedFolder}
        fileCount={14}
      />

      <IdentityVerificationModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onVerified={handleIdentityVerified}
        fileName={selectedFile}
      />

      <NewFolderSheet
        isOpen={showNewFolderSheet}
        onClose={() => setShowNewFolderSheet(false)}
        onCreate={handleCreateFolder}
      />
    </>
  );
}