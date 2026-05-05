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

  async function persistLinked(nextAccounts) {
    setLinkedAccounts(nextAccounts);
    setLinkError('');

    try {
      await saveLinkedAccounts(nextAccounts);
    } catch (err) {
      setLinkError('Account link could not be saved.');
    }
  }

  async function toggleLinked(providerId) {
    const nextAccounts = {
      ...linkedAccounts,
      [providerId]: !linkedAccounts[providerId],
    };

    await persistLinked(nextAccounts);
  }

  async function setLinked(providerId, value) {
    const nextAccounts = {
      ...linkedAccounts,
      [providerId]: value,
    };

    await persistLinked(nextAccounts);
  }

  async function mergeLinked(nextLinkedValues) {
    await persistLinked({
      ...linkedAccounts,
      ...nextLinkedValues,
    });
  }

  return {
    linkedAccounts,
    toggleLinked,
    setLinked,
    mergeLinked,
    linkError,
  };
}
