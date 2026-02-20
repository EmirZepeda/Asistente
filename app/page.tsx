"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { FaceIDAuth } from "./components/FaceIDAuth";
import { Dashboard, type FolderData } from "./components/Dashboard";
import { RestrictedAccessModal } from "./components/RestrictedAccessModal";
import { NewFolderSheet, type FolderType } from "./components/NewFolderSheet";
import { Settings } from "./components/Settings";
import { FolderContents } from "./components/FolderContents";
import { IdentityVerificationModal } from "./components/IdentityVerificationModal";
import { SecureViewer } from "./components/SecureViewer";
import { LoginActivity } from "./components/LoginActivity";
import { Onboarding } from "./components/Onboarding";
import { FolderDetailView } from "./components/FolderDetailView";
import { SignUp } from "./components/SignUp";
import { StorageManagementView } from "./components/StorageManagementView";

type Screen = 'onboarding' | 'auth' | 'dashboard' | 'settings' | 'folder' | 'viewer' | 'activity' | 'folderDetail' | 'signUp' | 'storage';

export default function VaultPage() {
  const { data: session, status } = useSession();
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [biometricVerified, setBiometricVerified] = useState(false);

  // Folders state
  const [folders, setFolders] = useState<FolderData[]>([]);

  // Protected Routes State
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showNewFolderSheet, setShowNewFolderSheet] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFolderSecurity, setSelectedFolderSecurity] = useState<'standard' | 'enhanced' | 'maximum'>('enhanced');

  // Fetch folders from API
  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch('/api/folders');
      if (response.ok) {
        const data = await response.json();
        // Map API response to FolderData
        const mapped: FolderData[] = data.map((f: any) => ({
          id: f.id,
          name: f.name,
          folderType: (f.folderType as FolderType) ?? 'privado',
          itemCount: f._count?.items ?? f.itemCount ?? 0,
          securityLevel: (f.securityLevel as 'standard' | 'enhanced' | 'maximum') ?? 'enhanced',
        }));
        setFolders(mapped);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }, []);

  // Effect to handle initial routing based on auth status
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      if (!['onboarding', 'signUp', 'auth'].includes(currentScreen)) {
        setCurrentScreen('onboarding');
      }
      setBiometricVerified(false);
    } else if (status === 'authenticated') {
      if (!biometricVerified) {
        setCurrentScreen('auth');
      } else {
        if (currentScreen === 'onboarding' || currentScreen === 'auth') {
          setCurrentScreen('dashboard');
        }
      }
    }
  }, [status, biometricVerified, currentScreen]);

  // Fetch folders when dashboard is shown
  useEffect(() => {
    if (currentScreen === 'dashboard' && status === 'authenticated') {
      fetchFolders();
    }
  }, [currentScreen, status, fetchFolders]);

  const handleAuthenticate = () => {
    setBiometricVerified(true);
    setCurrentScreen('dashboard');
  };

  const handleFolderClick = (folderName: string, folderId: string, securityLevel: 'standard' | 'enhanced' | 'maximum') => {
    setSelectedFolder(folderName);
    setSelectedFolderId(folderId);
    setSelectedFolderSecurity(securityLevel);
    setShowRestrictedModal(true);
  };

  const handleUnlockFolder = () => {
    setShowRestrictedModal(false);
    setCurrentScreen('folderDetail');
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
    setCurrentScreen('viewer');
  };

  const handleLockDocument = () => {
    setCurrentScreen('folderDetail');
  };

  const handleFolderStatusChange = async (folderId: string, status: 'hidden' | 'archived' | 'deleted') => {
    // Optimistically remove from active list
    setFolders(prev => prev.filter(f => f.id !== folderId));
    try {
      await fetch(`/api/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating folder status:', error);
      // Rollback
      fetchFolders();
    }
  };

  const handleCreateFolder = async (folderName: string, folderType: FolderType) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: folderName, folderType, securityLevel: 'enhanced' }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        const folderData: FolderData = {
          id: newFolder.id,
          name: newFolder.name,
          folderType: (newFolder.folderType as FolderType) ?? folderType,
          itemCount: 0,
          securityLevel: (newFolder.securityLevel as 'standard' | 'enhanced' | 'maximum') ?? 'enhanced',
        };
        // Add new folder to state immediately
        setFolders(prev => [...prev, folderData]);
        setSelectedFolder(newFolder.name);
        setSelectedFolderId(newFolder.id);
        setSelectedFolderSecurity('enhanced');
        setCurrentScreen('folderDetail');
      } else {
        console.error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0f1829] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {currentScreen === 'onboarding' && (
        <Onboarding
          onLogin={() => setCurrentScreen('auth')}
          onRegister={() => setCurrentScreen('signUp')}
        />
      )}

      {currentScreen === 'signUp' && (
        <SignUp
          onNavigateLogin={() => setCurrentScreen('auth')}
          onRegister={(data) => {
            console.log('Registering:', data);
            setCurrentScreen('dashboard');
          }}
        />
      )}

      {currentScreen === 'auth' && (
        <FaceIDAuth onAuthenticate={handleAuthenticate} />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard
          onFolderClick={handleFolderClick}
          onSettingsClick={handleSettingsClick}
          onStorageClick={() => setCurrentScreen('storage')}
          onNewFolderClick={() => setShowNewFolderSheet(true)}
          folders={folders}
          onFolderStatusChange={handleFolderStatusChange}
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
          onBack={() => setCurrentScreen('folderDetail')}
          onLock={handleLockDocument}
        />
      )}

      {currentScreen === 'activity' && (
        <LoginActivity onBack={handleBackToDashboard} />
      )}

      {currentScreen === 'folderDetail' && (
        <FolderDetailView
          folderName={selectedFolder}
          folderId={selectedFolderId}
          securityLevel={selectedFolderSecurity}
          onBack={handleBackToDashboard}
        />
      )}

      {currentScreen === 'storage' && (
        <StorageManagementView
          onBack={handleBackToDashboard}
          onRestoreFolder={(folderId, folderName) => {
            fetchFolders();
            setCurrentScreen('storage');
          }}
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