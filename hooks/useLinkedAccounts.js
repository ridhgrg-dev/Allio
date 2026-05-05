import { useEffect, useState } from 'react';
import { initialLinkedAccounts } from '../services/accountLinkService';
import { loadLinkedAccounts, saveLinkedAccounts } from '../services/storageService';

export default function useLinkedAccounts() {
  const [linkedAccounts, setLinkedAccounts] = useState(initialLinkedAccounts);
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const saved = await loadLinkedAccounts();
        if (mounted) {
          setLinkedAccounts(saved);
        }
      } catch (err) {
        if (mounted) {
          setLinkError('Saved account links could not be loaded.');
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  async function toggleLinked(providerId) {
    const nextAccounts = {
      ...linkedAccounts,
      [providerId]: !linkedAccounts[providerId],
    };

    setLinkedAccounts(nextAccounts);
    setLinkError('');

    try {
      await saveLinkedAccounts(nextAccounts);
    } catch (err) {
      setLinkError('Account link could not be saved.');
    }
  }

  return {
    linkedAccounts,
    toggleLinked,
    linkError,
  };
}
