using Mapster;
using Model = Pims.Api.Areas.Project.Models.Search;
using Entity = Pims.Dal.Entities;
using Pims.Api.Mapping.Converters;

namespace Pims.Api.Areas.Project.Mapping.Search
{
    public class ProjectMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.ProjectModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.StatusCode, src => src.Status == null ? null : src.Status.Code)
                .Map(dest => dest.Status, src => src.Status == null ? null : src.Status.Name)
                .Map(dest => dest.StatusRoute, src => src.Status == null ? null : src.Status.Route)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.TierLevel, src => src.TierLevel == null ? null : src.TierLevel.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.ExemptionRequested, src => src.ExemptionRequested)
                .Map(dest => dest.ExemptionRationale, src => src.ExemptionRationale)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Estimated, src => src.Estimated)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.Properties, src => src.Properties)
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.UpdatedBy,
                    src => src.UpdatedById != null ? src.UpdatedBy.DisplayName : null)
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.CreatedBy,
                    src => src.CreatedById != null ? src.CreatedBy.DisplayName : null)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
