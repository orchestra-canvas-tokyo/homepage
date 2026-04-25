export type OrganizationStatsMainBranchUpdateSkipReason = 'main_moved';

export type OrganizationStatsProductionPromotionSkipReason =
	| 'not_caught_up'
	| 'main_moved'
	| 'production_moved';

export type OrganizationStatsMainBranchUpdate =
	| {
			status: 'not_attempted';
	  }
	| {
			status: 'pushed';
	  }
	| {
			status: 'skipped';
			reason: OrganizationStatsMainBranchUpdateSkipReason;
	  };

export type OrganizationStatsProductionPromotion =
	| {
			status: 'not_attempted';
	  }
	| {
			status: 'merged';
	  }
	| {
			status: 'skipped';
			reason: OrganizationStatsProductionPromotionSkipReason;
	  };

export const hasMatchingBranchContent = (mainTreeSha: string, productionTreeSha: string): boolean =>
	mainTreeSha === productionTreeSha;

export const getOrganizationStatsProductionPromotionGate = ({
	currentMainSha,
	currentProductionSha,
	expectedMainSha,
	expectedProductionSha,
	mainBranchUpdate,
	preUpdateMainTreeSha,
	preUpdateProductionTreeSha
}: {
	currentMainSha: string;
	currentProductionSha: string;
	expectedMainSha: string;
	expectedProductionSha: string;
	mainBranchUpdate: OrganizationStatsMainBranchUpdate;
	preUpdateMainTreeSha: string;
	preUpdateProductionTreeSha: string;
}):
	| {
			status: 'ready';
	  }
	| {
			status: 'skipped';
			reason: OrganizationStatsProductionPromotionSkipReason;
	  } => {
	if (mainBranchUpdate.status === 'not_attempted') {
		return {
			status: 'skipped',
			reason: 'main_moved'
		};
	}

	if (mainBranchUpdate.status === 'skipped') {
		return {
			status: 'skipped',
			reason: mainBranchUpdate.reason
		};
	}

	if (!hasMatchingBranchContent(preUpdateMainTreeSha, preUpdateProductionTreeSha)) {
		return {
			status: 'skipped',
			reason: 'not_caught_up'
		};
	}

	if (currentMainSha !== expectedMainSha) {
		return {
			status: 'skipped',
			reason: 'main_moved'
		};
	}

	if (currentProductionSha !== expectedProductionSha) {
		return {
			status: 'skipped',
			reason: 'production_moved'
		};
	}

	return {
		status: 'ready'
	};
};
