
/**
 * Known GitHub repos.
 */
type GitHubRepo = 'gh.OpenXR-Docs' | 'gh.OpenXR-SDK-Source' | 'gh.OpenXR-CTS';
/**
 * Code for GitLab repo
 */
type GitLabRepo = 'gl';
/**
 * Type for any repo
 */
type Repo = GitHubRepo | GitLabRepo;
export type { GitHubRepo, GitLabRepo, Repo };

/**
 * Convenience object containing the repos by name.
 */
export const Repos: { [index in string]: Repo } = {
    InternalGitlab: 'gl',
    OpenXRDocs: 'gh.OpenXR-Docs',
    OpenXRSDKSource: 'gh.OpenXR-SDK-Source',
    OpenXRCTS: 'gh.OpenXR-CTS',
} as const;

export type GitHubRefType = 'issue' | 'pr';
export type GitLabRefType = 'issue' | 'mr';
export type RefType = GitHubRefType | GitLabRefType;


export const RefTypes: { [index: string]: RefType } = {
    Issue: 'issue',
    PullRequest: 'pr',
    MergeRequest: 'mr'
} as const;

export const RefTypeHumanName: { [index in RefType]: string } = {
    issue: 'Issue',
    pr: 'Pull Request',
    mr: 'Merge Request'
} as const;

const subdir: { [index in RefType]: string } = {
    issue: 'issues',
    pr: 'pull',
    mr: 'merge_requests',
} as const;;

function getGithubRepoName(repo: GitHubRepo): string {
    return repo.replace('gh.', '');
}

export const RepoHumanName: { [index in Repo]: string } = {
    ['gl']: 'Khronos internal OpenXR repo',
    ['gh.OpenXR-Docs']: `GitHub repo ${getGithubRepoName('gh.OpenXR-Docs')}`,
    ['gh.OpenXR-SDK-Source']: `GitHub repo ${getGithubRepoName('gh.OpenXR-SDK-Source')}`,
    ['gh.OpenXR-CTS']: `GitHub repo ${getGithubRepoName('gh.OpenXR-CTS')}`,
} as const;

const khronosGithubBase = 'https://github.com/KhronosGroup/';

const baseUrls: { [index in Repo]: string } = {
    ['gl']: 'https://gitlab.khronos.org/openxr/openxr',
    ['gh.OpenXR-Docs']: khronosGithubBase + getGithubRepoName('gh.OpenXR-Docs'),
    ['gh.OpenXR-SDK-Source']: khronosGithubBase + getGithubRepoName('gh.OpenXR-SDK-Source'),
    ['gh.OpenXR-CTS']: khronosGithubBase + getGithubRepoName('gh.OpenXR-CTS'),
} as const;

/**
 * Reference type that indicates a code change (not an issue) for each repo type.
 */
export const CodeChangeRefType: { [index in Repo]: RefType } = {
    ['gl']: 'mr',
    ['gh.OpenXR-Docs']: 'pr',
    ['gh.OpenXR-SDK-Source']: 'pr',
    ['gh.OpenXR-CTS']: 'pr',
} as const;

/**
 * A reference valid for GitLab
 */
export interface GitLabReference {
    repo: GitLabRepo,
    refType: GitLabRefType,
    refNumber: number,
    suffix?: string,
};

/**
 * A reference valid for a GitHub repo
 */
export interface GitHubReference {
    repo: GitHubRepo,
    refType: GitHubRefType,
    refNumber: number,
    suffix?: string,
}

/**
 * A type that only accepts valid GitHub or GitLab references.
 * 
 * (Won't let you mix merge requests and github, etc.)
 */
export type StrictGeneralReference = GitHubReference | GitLabReference;

// export interface GeneralReference {
//     repo: Repo,
//     refType: RefType,
//     refNumber: number
// }

/**
 * A substantially looser type that StrictGeneralReference: doesn't have to be complete or valid.
 */
export interface PartialReference {
    repo?: Repo | null | undefined,
    refType?: RefType | null | undefined,
    refNumber?: number | null | undefined,
    suffix?: string | null | undefined,
}

/**
 * An array of all repos, for iteration purposes
 */
export const AllRepos = Object.values(Repos);

export const getMostSimilarRefTypeForRepo = (repo: Repo, origRefType: RefType): RefType =>
    (origRefType == 'mr' || origRefType == 'pr')
        ? CodeChangeRefType[repo]
        : 'issue';

const githubRefTypes = new Set<GitHubRefType>(['issue', 'pr']);

const gitlabRefTypes = new Set<GitLabRefType>(['issue', 'mr']);

/**
 * The set of RefType values valid for a given Repo.
 * 
 * Note that if you're already using StrictGeneralReference, you don't need this.
 */
export const ValidRefTypes: { [index in Repo]: Set<RefType> } = (() => {
    let pairs: Array<[Repo, Set<RefType>]> = AllRepos.map((r) =>
        [r, (r == 'gl') ? gitlabRefTypes : githubRefTypes]);
    return Object.fromEntries(pairs) as { [index in Repo]: Set<RefType> };
})();

export function isReferenceValid(ref: PartialReference): boolean {
    if (!ref.hasOwnProperty('repo') || !ref.hasOwnProperty('refType') || !ref.hasOwnProperty('refNumber')) {
        return false;
    }
    if (!ref.repo || !ref.refType || !ref.refNumber) {
        return false;
    }
    return ValidRefTypes[ref.repo].has(ref.refType);
}

export function normalizeReference(ref: PartialReference): StrictGeneralReference | null {
    if (isReferenceValid(ref)) {
        return {
            repo: ref.repo ,
            refType: ref.refType,
            refNumber: ref.refNumber,
            suffix: ref.suffix,
        } as StrictGeneralReference;
    }
    return null
}

/**
 * Make the URL that will be linked in a changelog.
 * @param ref A valid reference
 */
export function makeUrl(ref: StrictGeneralReference): string {
    return `${baseUrls[ref.repo]}/${subdir[ref.refType]}/${ref.refNumber}`;
}

/**
 * Make the reference string to use for a filename or in the front matter.
 * @param ref A valid reference
 */
export function makeRefString(ref: StrictGeneralReference): string {
    let baseString = `${ref.refType}.${ref.refNumber}.${ref.repo}`;
    if (ref.hasOwnProperty('suffix') && ref.suffix) {
        return `${baseString}.${ref.suffix}`;
    }
    return baseString;
}
